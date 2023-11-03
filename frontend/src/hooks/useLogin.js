import axios from "axios";
import {useNavigate} from "react-router-dom";
import useToken from "./useToken";

// Need this as a hook so it can be reused in register as well as login
const useLogin = () => {
    const {setToken} = useToken()
    const navigate = useNavigate()

    return (username, password, errorHandler) => {
        axios.post('http://localhost:8000/account/login/', {
            "username": username,
            "password": password
        })
            .then(function (response) {
                console.log(response.data)
                setToken(response.data['token'])
                navigate("/")
                // trigger refresh to update navbar
                window.location.reload()
            })
            .catch(errorHandler);
    }
}

export default useLogin
