import React, { useEffect } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md';

const Toast = ({ isShown, message, type, onClose }) => {

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);


  return (
    <div className={`absolute top-20 right-6 trasition-all duration-400
     ${isShown ? "opacity-100" : "opacity-0"}`}>

      <div className={`bg-white border shadow-2xl rounded-md after:w-[5px] after:h-full
         ${type === "delete" ? "after:bg-red-500" : "after:bg-green-500"}
          after:absolute after:left-0 after:top-0 after-rounded-l-lg`}>

        <div className="flex item-center gap-3 py-2 px-4">
          <div className={`w-10 h-10 items-center justify-center rounded-full
             ${type === "delete" ? "bg-red-50" : "bg-green-50"}`} >

            {type === "delete" ? (
              <MdDeleteOutline className="text-ul test-green-500" />
            ) : (
              <FaCheck className="text-ul test-green-500" />
            )}
          </div>
          <p className='test-sm test-slate-800'>{message}</p>
         
        </div>
      </div>
    </div>
  );
};

export default Toast;