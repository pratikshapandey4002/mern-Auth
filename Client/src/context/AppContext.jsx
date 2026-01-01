import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    // Helper: Always plural for defaults
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    // FIX: Changed 'setisLoggedin' to 'setIsLoggedin' (Capital I)
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }


    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin, // Now this matches what you use in Login.jsx
        userData, setUserData,
        getUserData
    }

    return(
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider> 
    )
}