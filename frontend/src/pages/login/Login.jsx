import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import PasswordInp from '../../components/input/PasswordInp'
import { validateEmail } from '../../utilites/helper'
import axiosInstance from '../../utilites/axiosInstance'

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter valid email Id');
            return;
        }
        if (!password) {
            setError('Please enter password');
            return;
        }
        setError("");

        // login api
        try {
            const response = await axiosInstance.post("https://keep-1.onrender.com/login", {
                email: email,
                password: password,
            })

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.respsonse.data.message);
            } else {
                // setError("Eror occ")
            }
        }
    };
    return (
        <>
            <Navbar />

            <div className='flex items-center justify-center mt-28'>
                <div className='bg-white shadow-md rounded w-96  bg-white px-7 py-10'>
                    <form onSubmit={handleSubmit}>
                        <h4 className='text-2xl mvb-7'>Login</h4>

                        <div className='bg-transparent border-[1.5px] px-3 rounded my-5'>
                            <input type="text" placeholder='Email' className='w-full text-sm bg-trasnparent py-3 mr-3 rounded outline-none'
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                        <PasswordInp onChange={(e) => setPassword(e.target.value)} />

                        <button className="w-full max-w-sm mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Login</button>

                        <p className='text-sm text-center mt-4'> No Account ? {""}
                            <Link to="/SignUp" className='font-medium text-primary underline'>Create an Account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
