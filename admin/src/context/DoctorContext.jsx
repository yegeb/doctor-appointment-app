import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    
    const backendURL = import.meta.env.VITE_BACKEND_URL

    const [doctorToken, setDoctorToken] = useState(localStorage.getItem('doctorToken') ? localStorage.getItem('doctorToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)


    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/appointments', {headers : {doctorToken}})
            if (data.success) {
                setAppointments(data.appointments.reverse())
            }

            else {
                toast.error(data.message)
            }
        } 
        
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendURL + '/api/doctor/complete-appointment', {appointmentId}, {headers:{doctorToken}}) 
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            }

            else {
                toast.error(data.message)
            }
        } 
        
        catch (error) {
            console.log(error)
            toast.error(error.message) 
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendURL + '/api/doctor/cancel-appointment', {appointmentId}, {headers:{doctorToken}}) 
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            }

            else {
                toast.error(data.message)
            }
        } 
        
        catch (error) {
            console.log(error)
            toast.error(error.message) 
        }
    }

    const getDashData = async () => {   
        try {

            const {data} = await axios.get(backendURL + '/api/doctor/dashboard', {headers: {doctorToken}})
            if (data.success) {
                setDashData(data.dashData)
            }

            else {
                toast.error(data.message)
            }
        }

        catch (error) {
            console.log(error)
            toast.error(error.message) 
        }  
    }

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/profile', {headers: {doctorToken}})

            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)
            }

            else {
                toast.error(data.message)
            }
        } 
        
        catch (error) {
            console.log(error)
            toast.error(error.message) 
        }
    }

    const value = {
        backendURL,
        doctorToken, setDoctorToken,
        appointments, setAppointments,
        getAppointments,
        completeAppointment, cancelAppointment,
        dashData, setDashData, getDashData,
        profileData, setProfileData, getProfileData
    }
    
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>

    )
}

export default DoctorContextProvider