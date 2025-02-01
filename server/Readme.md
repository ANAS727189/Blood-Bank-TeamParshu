
---

# Blood Bank API Documentation

**Version:** 1.0  
**Date:** 2025-02-01

This API provides endpoints for four types of users: **Donors**, **Patients**, **Organisations**, and **Admins**. The API follows RESTful principles and uses JSON as the primary data format for both requests and responses. All endpoints that modify or access sensitive data require authentication via middleware (for example, `donorMiddleware`, `patientMiddleware`, etc.). Upon successful login, the user receives a token that must be sent with protected requests using the `Authorization` header.

> **Note:** When making requests to protected endpoints, include the token as follows:  
> `Authorization: Bearer <token>`

---

## Table of Contents

- [Common Routes](#common-routes)
- [Donor Endpoints](#donor-endpoints)
- [Patient Endpoints](#patient-endpoints)
- [Organisation Endpoints](#organisation-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Error Handling](#error-handling)

---

## Common Routes

Each user type has a similar set of common routes for account management. These include:

- **Register** – Create a new account.
- **Login** – Authenticate an existing account.
- **Send OTP** – Request a One-Time Password (OTP) for password reset or account verification.
- **Verify OTP** – Validate the OTP provided by the user.
- **Reset Password** – Change the account password.
- **Verify** – Check whether the user is authenticated.
- **Update** – Update the user’s account information.

The following sections provide details for each user type.

---

## Donor Endpoints

**Donor User Type:**  
Donors are individuals who are willing to donate blood or have donated in the past. They can view available donation locations, their donation history, and manage their account details.

### 1. Register Donor

- **URL:** `/register`
- **Method:** `POST`
- **Description:** Creates a new donor account in the system.
- **Request Body Example:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securePassword123",
    "phoneNo": "1234567890"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Donor registered successfully",
    "data": []
  }
  ```

---

### 2. Login Donor

- **URL:** `/login`
- **Method:** `POST`
- **Description:** Authenticates a donor using email and password, returning an access token for future requests.
- **Request Body Example:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securePassword123"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Donor logged in successfully",
    "data": "eyJhbGciOiJIUzI1..."
  }
  ```

---

### 3. Send OTP (Donor)

- **URL:** `/sendOtpDonor`
- **Method:** `POST`
- **Description:** Sends a One-Time Password to the donor’s registered email for password reset.
- **Request Body Example:**
  ```json
  {
    "email": "johndoe@example.com"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "OTP sent successfully",
    "data": []
  }
  ```

---

### 4. Verify OTP (Donor)

- **URL:** `/verifyOtpDonor`
- **Method:** `POST`
- **Description:** Validates the OTP provided by the donor.
- **Request Body Example:**
  ```json
  {
    "email": "johndoe@example.com",
    "otp": "123456"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "OTP verified successfully",
    "data": []
  }
  ```

---

### 5. Reset Password (Donor)

- **URL:** `/resetPassDonor`
- **Method:** `POST`
- **Description:** Resets the donor’s password using the provided OTP and new password.
- **Request Body Example:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "newSecurePassword456",
    "otp": "123456"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Password reset successfully",
    "data": []
  }
  ```

---

### 6. Get Donation Locations

- **URL:** `/donation-location`
- **Method:** `GET`
- **Middleware:** `donorMiddleware`
- **Description:** Retrieves a list of donation locations where the donor can donate blood. Each location includes details such as organisation, address, timings, and contact information.
- **Response Example:**
  ```json
  {
    "message": "Donation location fetched successfully",
    "data": [
      {
        "_id": "8q34f...",
        "organisationId": "2f433...",
        "name": "City Hospital",
        "contactDetails": "johndoe@email.com 9876543210",
        "location": "123 Main St, City, Country",
        "timings": "5 Feb to 9 Feb from 1pm to 6pm",
        "createdAt": "2025-01-01T10:00:00Z",
        "updatedAt": "2025-01-01T10:00:00Z",
        "__v": 0
      },
      {
        "_id": "5vb58...",
        "organisationId": "5v87o...",
        "name": "State Hospital",
        "contactDetails": "johndoe@email.com 9876543210",
        "location": "456 Main St, City, Country",
        "timings": "3 Feb to 4 Feb from 6am to 12pm",
        "createdAt": "2025-01-02T10:00:00Z",
        "updatedAt": "2025-01-02T10:00:00Z",
        "__v": 0
      }
    ]
  }
  ```

---

### 7. Get Donation History

- **URL:** `/donation-history`
- **Method:** `GET`
- **Middleware:** `donorMiddleware`
- **Description:** Retrieves a list of past blood donations made by the donor, including details about the donation date, quantity, and the organisation where the donation took place.
- **Response Example:**
  ```json
  {
    "message": "Donation history fetched successfully",
    "data": [
      {
        "_id": "679bt...",
        "donorId": "679ve...",
        "organisationId": {
          "_id": "679fr...",
          "name": "Abc Def Hospital"
        },
        "quantity": "2",
        "createdAt": "2025-01-15T14:00:00Z",
        "updatedAt": "2025-01-15T14:00:00Z",
        "__v": 0
      },
      {
        "_id": "6798k...",
        "donorId": "6796v...",
        "organisationId": {
          "_id": "6796d...",
          "name": "John Doe Clinic"
        },
        "quantity": "5",
        "createdAt": "2024-12-20T09:00:00Z",
        "updatedAt": "2024-12-20T09:00:00Z",
        "__v": 0
      }
    ]
  }
  ```

---

### 8. Verify Donor

- **URL:** `/verifyDonor`
- **Method:** `GET`
- **Middleware:** `donorMiddleware`
- **Description:** Confirms that the donor is authenticated and returns the donor’s profile details.
- **Response Example:**
  ```json
  {
    "message": "Donor verified successfully",
    "data": {
      "_id": "vwfc3...",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phoneNo": "1234567890",
      "password": "******",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z",
      "__v": 0
    }
  }
  ```

---

### 9. Update Donor Account

- **URL:** `/updateDonor`
- **Method:** `PUT`
- **Middleware:** `donorMiddleware`
- **Description:** Updates the authenticated donor’s account information. Fields such as name, email, or phone number can be updated.
- **Request Body Example:**
  ```json
  {
    "name": "Johnathan Doe",
    "phoneNo": "0987654321",
    "email": "Johndoe@email.com"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Donor updated successfully",
    "data": []
  }
  ```

---

## Patient Endpoints

**Patient User Type:**  
Patients are individuals in need of blood who can post blood requests, check the blood inventory of different organisations, and manage their account details.

### 1. Register Patient

- **URL:** `/register`
- **Method:** `POST`
- **Description:** Creates a new patient account.
- **Request Body Example:**
  ```json
  {
    "name": "Jane Smith",
    "email": "janesmith@example.com",
    "password": "patientPassword123",
    "phoneNo": "1122334455"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Patient registered successfully",
    "data": []
  }
  ```

---

### 2. Login Patient

- **URL:** `/login`
- **Method:** `POST`
- **Description:** Authenticates a patient and returns an access token for future requests.
- **Request Body Example:**
  ```json
  {
    "email": "janesmith@example.com",
    "password": "patientPassword123"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Patient login successful",
    "data": "Bearer eyJhbGciOiJIUzI1..."
  }
  ```

---

### 3. Send OTP (Patient)

- **URL:** `/sendOtpPatient`
- **Method:** `POST`
- **Description:** Sends an OTP to the patient’s registered email for password reset.
- **Request Body Example:**
  ```json
  {
    "email": "janesmith@example.com"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "OTP sent successfully",
    "data": []
  }
  ```

---

### 4. Verify OTP (Patient)

- **URL:** `/verifyOtpPatient`
- **Method:** `POST`
- **Description:** Validates the OTP provided by the patient.
- **Request Body Example:**
  ```json
  {
    "email": "janesmith@example.com",
    "otp": "654321"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "OTP verified successfully",
    "data": []
  }
  ```

---

### 5. Reset Password (Patient)

- **URL:** `/resetPassPatient`
- **Method:** `POST`
- **Description:** Resets the patient’s password using the provided new password and, if applicable, an OTP.
- **Request Body Example:**
  ```json
  {
    "email": "janesmith@example.com",
    "newPassword": "newPatientPassword456"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Password reset successful",
    "data": []
  }
  ```

---

### 6. Post Blood Request

- **URL:** `/bloodRequest`
- **Method:** `POST`
- **Middleware:** `patientMiddleware`
- **Description:** Submits a new blood request to the central database. The request includes details such as blood type and quantity.
- **Request Body Example:**
  ```json
  {
    "bloodType": "B-",
    "quantity": 2
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Blood request submitted successfully",
    "data": []
  }
  ```

---

### 7. Get Blood Requests

- **URL:** `/bloodRequests`
- **Method:** `GET`
- **Middleware:** `patientMiddleware`
- **Description:** Retrieves a list of blood requests made by the authenticated patient.
- **Response Example:**
  ```json
  {
    "message": "Blood requests fetched successfully",
    "data": [
      {
        "requestId": "req_001",
        "bloodType": "B-",
        "quantity": 2,
        "status": "Pending"
      }
    ]
  }
  ```

---

### 8. Get Blood Availability

- **URL:** `/bloodAvailable`
- **Method:** `GET`
- **Middleware:** `patientMiddleware`
- **Description:** Retrieves the current blood inventory across different organisations, showing available blood types and quantities.
- **Response Example:**
  ```json
  {
    "message": "Blood availability fetched successfully",
    "data": [
      {
        "organisation": "City Hospital",
        "bloodType": "B-",
        "quantity": 5
      },
      {
        "organisation": "Community Clinic",
        "bloodType": "A+",
        "quantity": 10
      }
    ]
  }
  ```

---

### 9. Verify Patient

- **URL:** `/verifyPatient`
- **Method:** `GET`
- **Middleware:** `patientMiddleware`
- **Description:** Confirms that the patient is authenticated and returns the patient’s profile information.
- **Response Example:**
  ```json
  {
    "message": "Patient is authenticated",
    "data": {
      "id": "patient_001",
      "name": "Jane Smith",
      "email": "janesmith@example.com"
    }
  }
  ```

---

### 10. Delete Blood Request

- **URL:** `/bloodRequest/:requestId`
- **Method:** `DELETE`
- **Middleware:** `patientMiddleware`
- **Description:** Deletes a specific blood request identified by its unique request ID.
- **URL Parameter:**  
  - `requestId` – Unique identifier for the blood request.
- **Response Example:**
  ```json
  {
    "message": "Blood request deleted successfully",
    "data": []
  }
  ```

---

### 11. Update Patient Account

- **URL:** `/updatePatient`
- **Method:** `PUT`
- **Middleware:** `patientMiddleware`
- **Description:** Updates the authenticated patient’s account details such as contact information and address.
- **Request Body Example:**
  ```json
  {
    "phoneNo": "6677889900",
    "address": "789 New Street, City"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Patient account updated successfully",
    "data": {
      "id": "patient_001",
      "name": "Jane Smith",
      "phoneNo": "6677889900",
      "address": "789 New Street, City"
    }
  }
  ```

---

## Organisation Endpoints

**Organisation User Type:**  
Organisations (such as hospitals and NGOs) can manage blood donation camps, update blood inventories, view blood requests from patients, and manage donation locations. They also have access to analytical data regarding donations and requests.

### 1. Register Organisation

- **URL:** `/register`
- **Method:** `POST`
- **Description:** Creates a new organisation account.
- **Request Body Example:**
  ```json
  {
    "organisationName": "City Hospital",
    "email": "contact@cityhospital.com",
    "password": "orgPassword123",
    "phoneNo": "1010101010"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Organisation registered successfully",
    "data": []
  }
  ```

---

### 2. Login Organisation

- **URL:** `/login`
- **Method:** `POST`
- **Description:** Authenticates an organisation and returns an access token.
- **Request Body Example:**
  ```json
  {
    "email": "contact@cityhospital.com",
    "password": "orgPassword123"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Organisation login successful",
    "data": "eyJhbGciOiJIUzI1..."
  }
  ```

---

### 3. Send OTP (Organisation)

- **URL:** `/sendOtpOrganisation`
- **Method:** `POST`
- **Description:** Sends an OTP to the organisation’s registered email for password reset.
- **Request Body Example:**
  ```json
  {
    "email": "contact@cityhospital.com"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "OTP sent successfully",
    "data": []
  }
  ```

---

### 4. Verify OTP (Organisation)

- **URL:** `/verifyOtpOrganisation`
- **Method:** `POST`
- **Description:** Validates the OTP provided by the organisation.
- **Request Body Example:**
  ```json
  {
    "email": "contact@cityhospital.com",
    "otp": "112233"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "OTP verified successfully",
    "data": []
  }
  ```

---

### 5. Reset Password (Organisation)

- **URL:** `/resetPassOrganisation`
- **Method:** `POST`
- **Description:** Resets the organisation’s password using the provided new password.
- **Request Body Example:**
  ```json
  {
    "email": "contact@cityhospital.com",
    "newPassword": "newOrgPassword456"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Password reset successful",
    "data": []
  }
  ```

---

### 6. Get Analytics

- **URL:** `/getAnalytics`
- **Method:** `GET`
- **Middleware:** `organisationMiddleware`
- **Description:** Retrieves analytical data for the organisation, such as total donations, pending requests, and completed requests.
- **Response Example:**
  ```json
  {
    "message": "Analytics data fetched successfully",
    "data": {
      "totalDonations": 120,
      "pendingRequests": 5,
      "completedRequests": 95
    }
  }
  ```

---

### 7. Get Inventory

- **URL:** `/getInventory`
- **Method:** `GET`
- **Middleware:** `organisationMiddleware`
- **Description:** Retrieves the current blood inventory of the organisation, detailing available blood types and their quantities.
- **Response Example:**
  ```json
  {
    "message": "Inventory fetched successfully",
    "data": [
      { "bloodType": "A+", "quantity": 10 },
      { "bloodType": "B-", "quantity": 5 }
    ]
  }
  ```

---

### 8. Get Blood Requests

- **URL:** `/getBloodRequests`
- **Method:** `GET`
- **Middleware:** `organisationMiddleware`
- **Description:** Retrieves all blood requests that have been submitted by patients and directed to the organisation.
- **Response Example:**
  ```json
  {
    "message": "Blood requests fetched successfully",
    "data": [
      {
        "requestId": "req_001",
        "patientName": "Jane Smith",
        "bloodType": "B-",
        "status": "Pending"
      }
    ]
  }
  ```

---

### 9. Get Donation Locations

- **URL:** `/getDonationLocations`
- **Method:** `GET`
- **Middleware:** `organisationMiddleware`
- **Description:** Retrieves a list of all donation locations managed by the organisation.
- **Response Example:**
  ```json
  {
    "message": "Donation locations fetched successfully",
    "data": [
      {
        "locationId": "loc_001",
        "name": "City Hospital Main Campus",
        "address": "123 Health Blvd, City"
      }
    ]
  }
  ```

---

### 10. Add Donation Location

- **URL:** `/addDonationLocation`
- **Method:** `POST`
- **Middleware:** `organisationMiddleware`
- **Description:** Adds a new donation location under the organisation’s management.
- **Request Body Example:**
  ```json
  {
    "name": "City Hospital West Wing",
    "address": "456 West St, City",
    "phoneNo": "1011121314"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Donation location added successfully",
    "data": {
      "locationId": "loc_002"
    }
  }
  ```

---

### 11. Add Blood Donated

- **URL:** `/addBloodDonated`
- **Method:** `POST`
- **Middleware:** `organisationMiddleware`
- **Description:** Records a new blood donation event using donor details.
- **Request Body Example:**
  ```json
  {
    "donorId": "donor_001",
    "bloodType": "A+",
    "quantity": 1,
    "donationDate": "2025-01-20"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Donation record added successfully",
    "data": []
  }
  ```

---

### 12. Update Inventory

- **URL:** `/updateInventory`
- **Method:** `PATCH`
- **Middleware:** `organisationMiddleware`
- **Description:** Updates the blood inventory of the organisation by modifying the quantity for a specific blood type.
- **Request Body Example:**
  ```json
  {
    "bloodType": "A+",
    "quantity": 15
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Inventory updated successfully",
    "data": []
  }
  ```

---

### 13. Complete Blood Request

- **URL:** `/completeBloodRequest`
- **Method:** `PATCH`
- **Middleware:** `organisationMiddleware`
- **Description:** Marks a patient’s blood request as completed, updating its status.
- **Request Body Example:**
  ```json
  {
    "requestId": "req_001",
    "status": "Completed"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Blood request marked as completed",
    "data": []
  }
  ```

---

### 14. Update Donation Location

- **URL:** `/updateDonationLocation`
- **Method:** `PATCH`
- **Middleware:** `organisationMiddleware`
- **Description:** Updates the details of an existing donation location managed by the organisation.
- **Request Body Example:**
  ```json
  {
    "locationId": "loc_002",
    "name": "City Hospital Updated West Wing",
    "address": "456 West St, New City"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Donation location updated successfully",
    "data": []
  }
  ```

---

### 15. Delete Donation Location

- **URL:** `/deleteDonationLocation`
- **Method:** `DELETE`
- **Middleware:** `organisationMiddleware`
- **Description:** Deletes a donation location managed by the organisation. The location identifier can be provided as a query parameter or in the request body.
- **Response Example:**
  ```json
  {
    "message": "Donation location deleted successfully",
    "data": []
  }
  ```

---

### 16. Update Organisation Account

- **URL:** `/updateorganisation`
- **Method:** `PUT`
- **Middleware:** `organisationMiddleware`
- **Description:** Updates the authenticated organisation’s account details, such as contact information or address.
- **Request Body Example:**
  ```json
  {
    "phoneNo": "1010102020",
    "address": "Updated Address, City"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Organisation account updated successfully",
    "data": []
  }
  ```

---

## Admin Endpoints

**Admin User Type:**  
Admins are responsible for overseeing the entire system. They can manage all types of user accounts, blood requests, donation locations, and view system-wide analytics.

### 1. Register Admin

- **URL:** `/register`
- **Method:** `POST`
- **Description:** Creates a new admin account.
- **Request Body Example:**
  ```json
  {
    "username": "adminUser",
    "email": "admin@example.com",
    "password": "adminPassword123"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Admin registered successfully",
    "data": []
  }
  ```

---

### 2. Login Admin

- **URL:** `/login`
- **Method:** `POST`
- **Description:** Authenticates an admin and returns an access token.
- **Request Body Example:**
  ```json
  {
    "email": "admin@example.com",
    "password": "adminPassword123"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Admin login successful",
    "data": "Bearer eyJhbGciOiJIUzI1..."
  }
  ```

---

### 3. Send OTP (Admin)

- **URL:** `/sendOtpAdmin`
- **Method:** `POST`
- **Description:** Sends an OTP to the admin’s registered email for password reset.
- **Request Body Example:**
  ```json
  {
    "email": "admin@example.com"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "OTP sent successfully",
    "data": []
  }
  ```

---

### 4. Verify OTP (Admin)

- **URL:** `/verifyOtpAdmin`
- **Method:** `POST`
- **Description:** Validates the OTP provided by the admin.
- **Request Body Example:**
  ```json
  {
    "email": "admin@example.com",
    "otp": "445566"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "OTP verified successfully",
    "data": []
  }
  ```

---

### 5. Reset Password (Admin)

- **URL:** `/resetPassAdmin`
- **Method:** `POST`
- **Description:** Resets the admin’s password.
- **Request Body Example:**
  ```json
  {
    "email": "admin@example.com",
    "newPassword": "newAdminPassword456"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Password reset successful",
    "data": []
  }
  ```

---

### 6. Verify Admin

- **URL:** `/verifyAdmin`
- **Method:** `GET`
- **Middleware:** `adminMiddleware`
- **Description:** Confirms that the admin is authenticated and returns the admin’s profile details.
- **Response Example:**
  ```json
  {
    "message": "Admin is authenticated",
    "data": {
      "id": "admin_001",
      "username": "adminUser",
      "email": "admin@example.com"
    }
  }
  ```

---

### 7. Get Donors

- **URL:** `/getDonors`
- **Method:** `GET`
- **Middleware:** `adminMiddleware`
- **Description:** Retrieves a list of all donor accounts in the system.
- **Response Example:**
  ```json
  {
    "message": "Donors fetched successfully",
    "data": [
      {
        "id": "donor_001",
        "name": "John Doe",
        "email": "johndoe@example.com"
      }
    ]
  }
  ```

---

### 8. Get Patients

- **URL:** `/getPatients`
- **Method:** `GET`
- **Middleware:** `adminMiddleware`
- **Description:** Retrieves a list of all patient accounts.
- **Response Example:**
  ```json
  {
    "message": "Patients fetched successfully",
    "data": [
      {
        "id": "patient_001",
        "name": "Jane Smith",
        "email": "janesmith@example.com"
      }
    ]
  }
  ```

---

### 9. Get Organisation

- **URL:** `/getOrganisation`
- **Method:** `GET`
- **Middleware:** `adminMiddleware`
- **Description:** Retrieves a list of all organisation accounts.
- **Response Example:**
  ```json
  {
    "message": "Organisations fetched successfully",
    "data": [
      {
        "id": "org_001",
        "organisationName": "City Hospital",
        "email": "contact@cityhospital.com"
      }
    ]
  }
  ```

---

### 10. Get Blood Requests (Admin)

- **URL:** `/getBloodRequests`
- **Method:** `GET`
- **Middleware:** `adminMiddleware`
- **Description:** Retrieves all blood requests across the system.
- **Response Example:**
  ```json
  {
    "message": "Blood requests fetched successfully",
    "data": [
      {
        "requestId": "req_001",
        "bloodType": "B-",
        "patientName": "Jane Smith",
        "status": "Pending"
      }
    ]
  }
  ```

---

### 11. Get Donation Locations (Admin)

- **URL:** `/getDonationLocations`
- **Method:** `GET`
- **Middleware:** `adminMiddleware`
- **Description:** Retrieves all donation locations from all organisations.
- **Response Example:**
  ```json
  {
    "message": "Donation locations fetched successfully",
    "data": [
      {
        "id": "loc_001",
        "name": "City Hospital Main Campus",
        "address": "123 Health Blvd, City"
      }
    ]
  }
  ```

---

### 12. Delete Donor (Admin)

- **URL:** `/deleteDonor`
- **Method:** `DELETE`
- **Middleware:** `adminMiddleware`
- **Description:** Deletes a donor account identified by the provided donor ID.
- **Request Parameter:**  
  - `donorId` (can be passed in the query string or request body)
- **Response Example:**
  ```json
  {
    "message": "Donor deleted successfully",
    "data": []
  }
  ```

---

### 13. Delete Patient (Admin)

- **URL:** `/deletePatient`
- **Method:** `DELETE`
- **Middleware:** `adminMiddleware`
- **Description:** Deletes a patient account.
- **Response Example:**
  ```json
  {
    "message": "Patient deleted successfully",
    "data": []
  }
  ```

---

### 14. Delete Organisation (Admin)

- **URL:** `/deleteOrganisation`
- **Method:** `DELETE`
- **Middleware:** `adminMiddleware`
- **Description:** Deletes an organisation account.
- **Response Example:**
  ```json
  {
    "message": "Organisation deleted successfully",
    "data": []
  }
  ```

---

### 15. Delete Blood Request (Admin)

- **URL:** `/deleteBloodRequest`
- **Method:** `DELETE`
- **Middleware:** `adminMiddleware`
- **Description:** Deletes a blood request from the system.
- **Response Example:**
  ```json
  {
    "message": "Blood request deleted successfully",
    "data": []
  }
  ```

---

### 16. Delete Donation Location (Admin)

- **URL:** `/deleteDonationLocation`
- **Method:** `DELETE`
- **Middleware:** `adminMiddleware`
- **Description:** Deletes a donation location from the system.
- **Response Example:**
  ```json
  {
    "message": "Donation location deleted successfully",
    "data": []
  }
  ```

---
