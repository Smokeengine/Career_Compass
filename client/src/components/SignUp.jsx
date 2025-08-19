import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Login } from "../redux/userSlice";
import { apiRequest } from "../utils/index.js";

import CustomButton from "./CustomButton";
import TextInput from "./TextInput";

const SignUp = ({ open, setOpen, setIsLoading: setParentLoading }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(true);
  const [accountType, setAccountType] = useState("seeker");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  let from = location.state?.from?.pathname || "/";

  const closeModal = () => {}; //setOpen(false);

  const onSubmit = async (data) => {
    let URL = null;
    
    // Set both loading states
    setIsLoading(true);
    setParentLoading(true);
    
    // Clear any previous error messages
    setErrMsg("");

    if (isRegister) {
      if (accountType === "seeker") {
        URL = "auth/register";
      } else URL = "companies/register";
    } else {
      if (accountType === "seeker") {
        URL = "auth/login";
      } else {
        URL = "companies/login";
      }
    }

    try {
      const res = await apiRequest({
        url: URL,
        data: data,
        method: "POST",
      });

      if (res?.status === "failed") {
        setErrMsg(res?.message);
      } else {
        if (isRegister) {
          setErrMsg("Account created successfully! Redirecting...");

          setTimeout(() => {
            window.location.replace("/");
          }, 5000);
        } else {
          setErrMsg("");
          const newData = { token: res?.token, ...res?.user };

          dispatch(Login(newData));
          localStorage.setItem("userInfo", JSON.stringify(newData));
          window.location.replace(from);
        }
      }
    } catch (error) {
      console.log(error);
      setErrMsg("Something went wrong. Please try again.");
    } finally {
      // Clear loading states
      setIsLoading(false);
      setParentLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={open || false}>
        <Dialog as='div' className='relative z-50' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto '>
            <div className='flex min-h-full items-center justify-center p-4 text-center '>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative'>
                  {/* Modal Loading Overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-2xl">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mb-3"></div>
                        <p className="text-gray-700 font-medium">
                          {isRegister ? "Creating account..." : "Signing in..."}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <Dialog.Title
                    as='h3'
                    className='text-xl font-semibold lwading-6 text-gray-900'
                  >
                    {isRegister ? "Create Account" : "Account Sign In"}
                  </Dialog.Title>

                  <div className='w-full flex items-center justify-center py-4 '>
                    <button
                      className={`flex hover:cursor-pointer flex-1 px-4 py-2 rounded text-sm justify-center items-center outline-none transition-colors ${
                        accountType === "seeker"
                          ? "bg-[#1d4fd862] text-blue-900 font-semibold"
                          : "bg-white border border-blue-400"
                      } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                      onClick={() => !isLoading && setAccountType("seeker")}
                      disabled={isLoading}
                    >
                      User Account
                    </button>
                    <button
                      className={`flex flex-1 px-4 py-2 hover:cursor-pointer ml-1 justify-center items-center rounded text-sm outline-none transition-colors ${
                        accountType !== "seeker"
                          ? "bg-[#1d4fd862] text-blue-900 font-semibold"
                          : "bg-white border border-blue-400"
                      } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                      onClick={() => !isLoading && setAccountType("company")}
                      disabled={isLoading}
                    >
                      Company Account
                    </button>
                  </div>

                  <form
                    className='w-full flex flex-col gap-5'
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <TextInput
                      name='email'
                      label='Email Address'
                      placeholder='email@example.com'
                      type='email'
                      register={register("email", {
                        required: "Email Address is required!",
                      })}
                      error={errors.email ? errors.email.message : ""}
                      disabled={isLoading}
                    />

                    {isRegister && (
                      <div className='w-full flex gap-1 md:gap-2'>
                        <div
                          className={`${
                            accountType === "seeker" ? "w-1/2" : "w-full"
                          }`}
                        >
                          <TextInput
                            name={
                              accountType === "seeker" ? "firstName" : "name"
                            }
                            label={
                              accountType === "seeker"
                                ? "First Name"
                                : "Company Name"
                            }
                            placeholder={
                              accountType === "seeker"
                                ? "eg. James"
                                : "Company name"
                            }
                            type='text'
                            register={register(
                              accountType === "seeker" ? "firstName" : "name",
                              {
                                required:
                                  accountType === "seeker"
                                    ? "First Name is required"
                                    : "Company Name is required",
                              }
                            )}
                            error={
                              accountType === "seeker"
                                ? errors.firstName
                                  ? errors.firstName?.message
                                  : ""
                                : errors.name
                                ? errors.name?.message
                                : ""
                            }
                            disabled={isLoading}
                          />
                        </div>

                        {accountType === "seeker" && isRegister && (
                          <div className='w-1/2'>
                            <TextInput
                              name='lastName'
                              label='Last Name'
                              placeholder='Wagonner'
                              type='text'
                              register={register("lastName", {
                                required: "Last Name is required",
                              })}
                              error={
                                errors.lastName ? errors.lastName?.message : ""
                              }
                              disabled={isLoading}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className='w-full flex gap-1 md:gap-2'>
                      <div className={`${isRegister ? "w-1/2" : "w-full"}`}>
                        <TextInput
                          name='password'
                          label='Password'
                          placeholder='Password'
                          type='password'
                          register={register("password", {
                            required: "Password is required!",
                          })}
                          error={
                            errors.password ? errors.password?.message : ""
                          }
                          disabled={isLoading}
                        />
                      </div>

                      {isRegister && (
                        <div className='w-1/2'>
                          <TextInput
                            id="confirmPassword"
                            name='confirmPassword'
                            label='Confirm Password'
                            placeholder='Password'
                            type='password'
                            register={register("confirmPassword", {
                              validate: (value) => {
                                const { password } = getValues();
                                if (password !== value) {
                                  return "Passwords do not match";
                                }
                              },
                            })}
                            error={
                              errors.confirmPassword
                                ? errors.confirmPassword?.message
                                : ""
                            }
                            disabled={isLoading}
                          />
                        </div>
                      )}
                    </div>

                    {errMsg && (
                      <span
                        role='alert'
                        className={`text-sm mt-0.5 font-medium ${
                          errMsg.includes("successfully") 
                            ? "text-green-600" 
                            : "text-red-500"
                        }`}
                      >
                        {errMsg}
                      </span>
                    )}

                    <div className='mt-2'>
                      <CustomButton
                        type='submit'
                        containerStyles={`inline-flex justify-center rounded-md px-8 py-2 text-sm font-medium text-white outline-none transition-all duration-200 ${
                          isLoading 
                            ? "bg-blue-400 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                        } w-full`}
                        title={
                          isLoading 
                            ? (
                                <span className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                  {isRegister ? "Creating Account..." : "Signing In..."}
                                </span>
                              )
                            : (isRegister ? "Create Account" : "Login Account")
                        }
                        disabled={isLoading}
                      />  
                    </div>
                  </form>

                  <div className='mt-4'>
                    <p className='text-sm text-gray-700'>
                      {isRegister
                        ? "Already have an account?"
                        : "Don't have an account?"}

                      <span
                        className={`text-sm ml-2 transition-colors ${
                          isLoading 
                            ? "text-gray-400 cursor-not-allowed" 
                            : "text-blue-600 hover:text-blue-700 hover:font-semibold cursor-pointer"
                        }`}
                        onClick={() => !isLoading && setIsRegister((prev) => !prev)}
                      >
                        {isRegister ? "Sign In" : "Create Account"}
                      </span>
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default SignUp
