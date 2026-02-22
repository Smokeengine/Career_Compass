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
      
      <SignUp open={open} setOpen={setOpen} setIsLoading={setIsLoading} />
    </div>
  );
};

export default Auth;
