import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"


const PasswordInp = ({ value, onChange, placeholder }) => {
    const [isShownPassword, setIsShownPassword] = useState(false);

    const toggleShowPassword = () => {
        setIsShownPassword(!isShownPassword)
    };
    return (
        <>
            <div className='flex items-center bg-transparent border-[1.5px] px-3 rounded '>
                <input value={value} onChange={onChange}
                    type={isShownPassword ? 'text' : 'password'}
                    placeholder={placeholder || 'Password'}
                    className='w-full text-sm bg-trasnparent py-3 mr-3 rounded outline-none' />

                {isShownPassword
                    ? <FaRegEye size={22} className="text-primary cursor-pointer" onClick={() => toggleShowPassword()} />
                    : <FaRegEyeSlash size={22} className="text-slate-400 cursor-pointer" onClick={() => toggleShowPassword()} />
                }
            </div>


        </>
    )
}

export default PasswordInp