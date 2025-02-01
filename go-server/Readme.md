
---

# ChatBot Microservice API Documentation

*Version:* 1.0  
*Date:* 2025-02-01

This microservice provides specialized chat functionality based on a RAG (Retrieval-Augmented Generation) model, in addition to fetching user data and storing survey information from various user types (Admin, Donor, Organisation, Patient). It uses a MongoDB backend for data storage and JWT-based authentication (with middleware provided by the main server) for securing endpoints.

The microservice also communicates with an external chat API (Vectara) to generate context-aware responses. Survey data is stored in separate collections for donors and patients.

> *Note:*  
> - Endpoints under /admin, /donor, /organisation, and /patient require a valid JWT token.  
> - The token is passed via the Authorization header as Bearer <token>.  
> - This microservice fetches data from the main database and relies on the main server for authentication.

---

## Table of Contents

- [Overview](#overview)
- [Models and Data Structures](#models-and-data-structures)
- [Endpoints](#endpoints)
  - [Admin Endpoints](#admin-endpoints)
  - [Donor Endpoints](#donor-endpoints)
  - [Organisation Endpoints](#organisation-endpoints)
  - [Patient Endpoints](#patient-endpoints)
  - [Chat Endpoint](#chat-endpoint)
- [Error Handling](#error-handling)

---

## Overview

This microservice supports four user types:

- *Admin:* Users with elevated privileges who can retrieve administrative data.
- *Donor:* Individuals who donate blood and can submit surveys regarding their health before donation.
- *Organisation:* Entities (e.g., hospitals or NGOs) that manage donation events and view organisational data.
- *Patient:* Users in need of blood who can submit health surveys related to their condition.

The service uses the following packages:

- *controller:* Contains business logic for retrieving users, processing surveys, and invoking the chat API.
- *model:* Contains schema definitions for Admin, Donor, Organisation, Patient, and Survey.
- *route:* Defines the HTTP routes (using Fiber) that map to the controller functions.
- *middleware:* Provides JWT-based authentication for protected routes.

---

## Models and Data Structures

### User Schema (Admin, Donor, Organisation, Patient)

Each user type shares a similar schema structure:

go
type Admin struct {
    ID        primitive.ObjectID `json:"id" bson:"_id"`
    Name      string             `json:"name" bson:"name"`
    Email     string             `json:"email" bson:"email"`
    Password  string             `json:"password" bson:"password"`
    PhoneNo   string             `json:"phoneNo" bson:"phoneNo"`
    CreatedAt primitive.DateTime `json:"createdAt" bson:"createdAt"`
    UpdatedAt primitive.DateTime `json:"updatedAt" bson:"updatedAt"`
}


> *Note:* Donor, Organisation, and Patient schemas follow the same structure.

### Survey Schema

The survey model captures health-related details provided by Donors or Patients:

go
type Survey struct {
    DonorID                 primitive.ObjectID `json:"donor_id"`
    SymptomsIllness         string             `json:"symptoms_illness"`          
    RecentMedicalProcedures string             `json:"recent_medical_procedures"` 
    TravelHistory           string             `json:"travel_history"`            
    MedicalConditions       string             `json:"medical_conditions"`        
    HighRiskExposure        string             `json:"high_risk_exposure"`        
    OtherIssues             []HealthIssue      `json:"other_issues"`              
}


The HealthIssue type is defined as a string with possible values (e.g., "cancer", "heart_disease", etc.).

---

## Endpoints

Below are the main endpoints provided by this microservice. Each endpoint description includes the HTTP method, URL path, a detailed description, and sample request/response examples.

### Admin Endpoints

#### 1. *Get Admin Data*

- *URL:* /admin/getAdminData
- *Method:* GET
- *Middleware:* AdminMiddleware
- *Description:*  
  Retrieves the profile details of the authenticated admin user. The user ID is extracted from the JWT token.
- *Sample Request:*
  http
  GET /admin/getAdminData HTTP/1.1
  Host: your-api-domain.com
  Authorization: Bearer eyJhbGciOiJIUzI1...
  
- *Sample Response:*
  json
  {
    "message": "Admin user found successfully",
    "admin": {
      "id": "603dcd9a2e8b2b3d1c8a1234",
      "name": "Admin User",
      "email": "admin@example.com",
      "phoneNo": "1234567890",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    }
  }
  

---

### Donor Endpoints

#### 1. *Get Donor Data*

- *URL:* /donor/getDonorData
- *Method:* GET
- *Middleware:* DonorMiddleware
- *Description:*  
  Retrieves the profile details of the authenticated donor. The donor's ID is taken from the JWT token.
- *Sample Request:*
  http
  GET /donor/getDonorData HTTP/1.1
  Host: your-api-domain.com
  Authorization: Bearer eyJhbGciOiJIUzI1...
  
- *Sample Response:*
  json
  {
    "message": "Donor user found successfully",
    "donor": {
      "id": "603dcd9a2e8b2b3d1c8a5678",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phoneNo": "1234567890",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    }
  }
  

#### 2. *Post Donor Survey*

- *URL:* /donor/postDonorSurvey
- *Method:* POST
- *Middleware:* DonorMiddleware
- *Description:*  
  Accepts a survey submission from the authenticated donor. The survey is stored in the donorSurvey collection. In addition, the JSON representation of the survey is sent as a file upload to an external API (Vectara) for further processing.
- *Sample Request:*
  http
  POST /donor/postDonorSurvey HTTP/1.1
  Host: your-api-domain.com
  Authorization: Bearer eyJhbGciOiJIUzI1...
  Content-Type: application/json

  {
    "symptoms_illness": "Fever and cough",
    "recent_medical_procedures": "None",
    "travel_history": "Traveled internationally in last 14 days",
    "medical_conditions": "None",
    "high_risk_exposure": "No",
    "other_issues": ["asthma"]
  }
  
- *Sample Response:*
  json
  {
    "message": "Survey added successfully",
    "entry": {
      "insertedID": "603e0b9f2e8b2b3d1c8a9abc"
    }
  }
  

---

### Organisation Endpoints

#### 1. *Get Organisation Data*

- *URL:* /organisation/getOrganisationData
- *Method:* GET
- *Middleware:* OrganisationMiddleware
- *Description:*  
  Retrieves the profile details of the authenticated organisation. The organisation's ID is obtained from the JWT token.
- *Sample Request:*
  http
  GET /organisation/getOrganisationData HTTP/1.1
  Host: your-api-domain.com
  Authorization: Bearer eyJhbGciOiJIUzI1...
  
- *Sample Response:*
  json
  {
    "message": "Org found successfully",
    "donor": {
      "id": "603dcd9a2e8b2b3d1c8a9876",
      "organisationName": "City Hospital",
      "email": "contact@cityhospital.com",
      "phoneNo": "1010101010",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    }
  }
  
  > *Note:* Although the returned key is labeled "donor" in the code, it represents organisation data. You may consider renaming the response field for clarity.

---

### Patient Endpoints

#### 1. *Get Patient Data*

- *URL:* /patient/getPatientnData
- *Method:* GET
- *Middleware:* PatientMiddleware
- *Description:*  
  Retrieves the profile details of the authenticated patient. The patient’s ID is extracted from the JWT token.
- *Sample Request:*
  http
  GET /patient/getPatientnData HTTP/1.1
  Host: your-api-domain.com
  Authorization: Bearer eyJhbGciOiJIUzI1...
  
- *Sample Response:*
  json
  {
    "message": "Patient user found successfully",
    "donor": {
      "id": "603dcd9a2e8b2b3d1c8ab234",
      "name": "Jane Smith",
      "email": "janesmith@example.com",
      "phoneNo": "1122334455",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    }
  }
  
  > *Note:* Similar to the organisation endpoint, the response key is "donor" though it represents patient data; consider renaming it for clarity.

#### 2. *Post Patient Survey*

- *URL:* /patient/postPatientSurvey
- *Method:* POST
- *Middleware:* PatientMiddleware
- *Description:*  
  Submits a survey for a patient. The survey data is stored in the patientSurvey collection.
- *Sample Request:*
  http
  POST /patient/postPatientSurvey HTTP/1.1
  Host: your-api-domain.com
  Authorization: Bearer eyJhbGciOiJIUzI1...
  Content-Type: application/json

  {
    "symptoms_illness": "Headache and nausea",
    "recent_medical_procedures": "None",
    "travel_history": "Local travel only",
    "medical_conditions": "None",
    "high_risk_exposure": "No",
    "other_issues": ["hypertension"]
  }
  
- *Sample Response:*
  json
  {
    "message": "Survey added successfully"
  }
  

---

### Chat Endpoint

#### 1. *Chat*

- *URL:* /chat
- *Method:* POST
- *Description:*  
  This endpoint accepts a query string and communicates with an external chat API (Vectara) to generate a specialized response. The response is generated using search and generation parameters defined in the payload.
- *Sample Request:*
  http
  POST /chat HTTP/1.1
  Host: your-api-domain.com
  Content-Type: application/json

  {
    "query": "What are the symptoms of diabetes?"
  }
  
- *Sample Response:*
  json
  {
    "response": "{ ... chat response from Vectara API ... }"
  }
  

---

## Error Handling

The API returns errors in a consistent JSON format with an "error" field. Common error statuses include:

- *400 Bad Request:* When required parameters are missing or invalid.
- *401 Unauthorized:* When authentication fails or a valid JWT token is not provided.
- *403 Forbidden:* When the user does not have permission to access the resource.
- *404 Not Found:* When a requested resource (user/survey) cannot be found.
- *500 Internal Server Error:* When an unexpected error occurs on the server.

*Example Error Response:*
json
{
  "error": "Detailed error message describing the issue."
}


---

## Additional Notes

- *Authentication:*  
  Protected routes require a valid JWT token provided by the main server. Use the Authorization header with the format Bearer <token>.

- *External API Integration:*  
  The chat functionality uses the Vectara API. Ensure that the environment variable API_KEY is set correctly to allow authenticated communication with the external service.

- *Data Flow:*  
  This microservice reads from the bloodbank database and interacts with collections such as admins, donors, organisations, patients, donorSurvey, and patientSurvey.

- *Middleware:*  
  Routes are grouped under different user types using custom middleware (e.g., AdminMiddleware, DonorMiddleware, etc.) that validate JWT tokens and populate the request context with the user ID.

---

