import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const currency = '$'

    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear()
        return age   
    }

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_') // ["12","08","2025"]
        const day = dateArray[0]
        const month = months[Number(dateArray[1]) - 1] // 08 -> 7 -> "Aug"
        const year = dateArray[2]
        return `${day} ${month} ${year}`
    }

    const value = {
        calculateAge,
        slotDateFormat,
        currency
    }
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>

    )
}

export default AppContextProvider