import React, { createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// TODO: get the BACKEND_URL.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/*
 * This provider should export a `user` context state that is 
 * set (to non-null) when:
 *     1. a hard reload happens while a user is logged in.
 *     2. the user just logged in.
 * `user` should be set to null when:
 *     1. a hard reload happens when no users are logged in.
 *     2. the user just logged out.
 */
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState();

    useEffect(() => {
        // TODO: complete me, by retriving token from localStorage and make an api call to GET /user/me.
        getUser();
    }, [])

    const getUser = async () => {
        const token = localStorage.getItem("token");

        if (token == null)
        {
            setUser(null);
            return;
        }

        try {
            await fetch(BACKEND_URL + "/user/me", {
                method: "GET",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }
            }).then(async (res) => {
                const data = await res.json();

                if (res.ok) {
                    setUser(data.user);
                } 
                else 
                {
                    setUser(null);
                    localStorage.removeItem("token");
                    console.log("Fetch failed");
                }
            });
        } 
        catch (error) 
        {
            console.log("Error:", error);
        }
    }

    /*
     * Logout the currently authenticated user.
     *
     * @remarks This function will always navigate to "/".
     */
    const logout = () => {
        // TODO: complete me
        setUser(null);
        localStorage.removeItem("token");
        navigate("/");
    };

    /**
     * Login a user with their credentials.
     *
     * @remarks Upon success, navigates to "/profile". 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {string} - Upon failure, Returns an error message.
     */
    const login = async (username, password) => {
        // TODO: complete me
        try {
            await fetch(BACKEND_URL + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    navigate("/profile");
                } else {
                    return data.message;
                }
            });
        } 
        catch (error) 
        {
            console.log("Error:", error);
        }
    };

    /**
     * Registers a new user. 
     * 
     * @remarks Upon success, navigates to "/".
     * @param {Object} userData - The data of the user to register.
     * @returns {string} - Upon failure, returns an error message.
     */
    const register = async (userData) => {
        // TODO: complete me

        try {
            await fetch(BACKEND_URL + "/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    navigate("/");
                    return data.message;
                } else {
                    return data.message;
                }
            });
        } 
        catch (error) 
        {
            console.log("Error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
