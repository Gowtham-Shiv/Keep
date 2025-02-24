import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { FaXmark } from "react-icons/fa6";

const Search = ({ value, onChange, handleSearch, onClearSearch }) => {
    return (
        <>
            <div className='w-80 flex items-center px-6 py-2 bg-slate-100 rounded-md'>
                <input type="text" placeholder='Search' className='w-full text-xs bg-transparent outline-none'
                    value={value} onChange={onChange}
                />

                {value && (
                    <FaXmark className='text-slate-400 cursor-pointer hover:text-black mr-3' onClick={onClearSearch} />
                )}
                
                <FaMagnifyingGlass className='text-slate-400 cursor-pointer hover:text-black' onClick={handleSearch} />

            </div>

        </>
    )
}

export default Search;