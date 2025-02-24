import React from 'react'

const EmptyCard = ({imgSrc, message}) => {
    return (
        <div className='flex flex-col items-center justify-center mt-25'>
            <img src={imgSrc} alt="No Note" className='w-60' />

            <p className='text-center w-1/2 text-sm font-medium test-slate-700 test-center leading-7 mt-5'>
                {message}</p>
        </div>
    )
}

export default EmptyCard;