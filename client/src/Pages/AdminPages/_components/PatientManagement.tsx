import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/util/axiosInstance"
import { motion } from "framer-motion"
import { useThemeStore } from "@/store/themeStore"
import { UserPlus, Mail, Phone, XCircle } from "lucide-react"
import { toast } from "react-hot-toast"

interface IPatient {
    _id: string
    name: string
    email: string
    phoneNo?: string
    }

    const PatientManagement = () => {
    const [patients, setPatients] = useState<IPatient[]>([])
    const { theme } = useThemeStore()

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
        const { data } = await axiosInstance.get("/admin/getPatients")
        setPatients(data.data)
        } catch (error) {
        console.error("Error fetching patients:", error)
        toast.error("Failed to fetch patients. Please try again.")
        }
    }

    const handleDelete = async (patientId: string) => {
        try {
        await axiosInstance.delete("/admin/deletePatient", { data: { patientId } })
        await fetchPatients()
        toast.success("Patient deleted successfully.")
        } catch (error) {
        console.error("Error deleting patient:", error)
        toast.error("Failed to delete patients. Please try again.")
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card
            className={`${
            theme === "light" ? "bg-white border-gray-200 shadow-sm" : "bg-base-200/50 backdrop-blur-sm border-primary/10"
            }`}
        >
            <CardHeader>
            <CardTitle className={`flex items-center ${theme === "light" ? "text-gray-800" : ""}`}>
                <UserPlus className="w-6 h-6 mr-2 text-blue-500" />
                Patient Management
            </CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow className={theme === "light" ? "bg-gray-50 text-gray-500" : ""}>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {patients.map((patient) => (
                    <TableRow
                    key={patient._id}
                    className={`hover:${theme === "light" ? "bg-gray-50 text-gray-600" : "bg-base-300/10"}`}
                    >
                    <TableCell>
                        <div className="flex items-center">
                        <UserPlus className="w-4 h-4 mr-2 text-gray-500" />
                        {patient.name}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        {patient.email}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        {patient.phoneNo || "N/A"}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Button
                        variant="destructive"
                        onClick={() => handleDelete(patient._id)}
                        className={`${
                            theme === "light"
                            ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                            : "bg-destructive/20 text-destructive hover:bg-destructive/30"
                        }`}
                        >
                        <XCircle className="w-4 h-4 mr-2" />
                        Delete
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        </motion.div>
    )
}

export default PatientManagement

