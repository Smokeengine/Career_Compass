import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Office } from "../assets";
import { SignUp } from "../components";

const Auth = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  
  let from = location?.state?.from?.pathname || "/";
  
  if (user.token) {
    return window.location.replace(from);
  }
  
  return (
    <div className='w-full relative'>
      <img src={Office} alt='Office' className='object-contain' />
      
      {/* Loading Overlay - Higher z-index to show above modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-xl">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
            <p className="text-gray-700 font-medium text-lg">Processing your request...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait</p>
          </div>
        </div>
      )}
      
      <SignUp open={open} setOpen={setOpen} setIsLoading={setIsLoading} />
    </div>
  );
};

export default Auth;
