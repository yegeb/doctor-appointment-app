import { createContext, useState, useEffect } from "react";
import { toast }                              from 'react-toastify'
import axios                                  from "axios"


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendURL = import.meta.env.VITE_BACKEND_URL

    const [doctors  , setDoctors   ] = useState([])
    const [userToken, setUserToken ] = useState(localStorage.getItem('userToken') ? localStorage.getItem('userToken') : false)
    const [userData , setUserData  ] = useState(false)

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/list')

            if (data.success) {
                setDoctors(data.doctors)
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

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/user/get-profile', {headers: {userToken}})

            if (data.success) {
                setUserData(data.userData)
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
        doctors, getDoctorsData,
        currencySymbol,
        userToken: userToken, setUserToken: setUserToken,
        backendURL,
        userData, setUserData,
        loadUserProfileData
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (userToken) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }   
    }, [userToken])

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider