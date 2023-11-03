import {useState} from 'react';
import axios from "axios";

const TOKEN_KEY = 'token';

export default function useToken() {

    // get auth token from local storage
    const getToken = () => {
        const tokenString = sessionStorage.getItem(TOKEN_KEY);
        const userToken = JSON.parse(tokenString);
        console.log('getToken => ' + userToken)
        return userToken
    }

    // const getUsername = () => {
    //     const tokenString = sessionStorage.getItem('username');
    //     const userToken = JSON.parse(tokenString);
    //     console.log(userToken)
    //     return userToken
    // }

    // Initialize token state with getToken()
    const [token, setToken] = useState(getToken());
    //const [username, setUsername] = useState(getUsername())



    // Save token to local storage
    const saveToken = (userToken) => {
        console.log('saving token: ' + userToken)
        sessionStorage.setItem(TOKEN_KEY, JSON.stringify(userToken));
        setToken(userToken);
        axios.defaults.headers.common['Authorization'] = `Token ${userToken}`;
    };

    const removeToken = () => {
        console.log('removing token')
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
    }

    // Return setToken, token, and removeToken to be used on other pages :)
    return {
        token,
        setToken: saveToken,
        removeToken: removeToken
    }

}