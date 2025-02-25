import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import PasswordInp from '../../components/input/PasswordInp';
import axiosInstance from '../../utilites/axiosInstance';
import { validateEmail } from '../../utilites/helper';

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("please enter name")
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter valid email Id');
      return;
    }
    if (!password) {
      setError('Please enter password');
      return;
    }
    setError("");

    // sigunup api
    try {
      const response = await axiosInstance.post("https://keep-1.onrender.com/create-account", {
        fullName: name,
        email: email,
        password: password,
      })

      if (response.data && response.data.error) {
        setError(response.data.message)
        return
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.respsonse.data.message);
      } else {
        setError("Eror occ")
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 rounded bg-white px-7 py-10'>
          <h4 className='text-2xl mvb-7'>SignUp</h4>

          <form onSubmit={handleSignUp}>
            <div className='bg-transparent border-[1.5px] px-3 rounded my-5'>
              <input type="text" placeholder='FullName' className='w-full text-sm bg-trasnparent py-3 mr-3 rounded outline-none' onChange={(e) => setName(e.target.value)} />
            </div>

            <div className='bg-transparent border-[1.5px] px-3 rounded my-5'>
              <input type="text" placeholder='Email' className='w-full text-sm bg-trasnparent py-3 mr-3 rounded outline-none' onChange={(e) => setEmail(e.target.value)} />
            </div>

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <PasswordInp onChange={(e) => setPassword(e.target.value)} />

            <button className="w-full max-w-sm mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Create Account</button>

            <p className='text-sm text-center mt-4'>
              <Link to="/login" className='font-medium text-primary underline'>Already having an Account!</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp
