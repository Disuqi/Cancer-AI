"use client"

import Modal from "react-modal";
import {IoIosCloseCircle} from "react-icons/io";
import {useState} from "react";
import {useRecoilState} from "recoil";
import {signInModalState} from "@/app/atoms/authentication";
import {supabase} from "@/lib/supabase";
import {toast} from "react-hot-toast";
import {defaultModalStyle} from "@/lib/constants";


export default function AuthenticationModal()
{
    const [formState, setFormState] = useState<"Sign In" | "Sign Up" | "Reset Password">("Sign In");
    const [signInModalOpen, setSignInModalOpen] = useRecoilState(signInModalState);

    const signIn = async (e: any) =>
    {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        const response = await supabase.auth.signInWithPassword({email: email, password: password});
        if(response.error)
        {
            toast.error("Failed to sign in!");
        }
        else
        {
            toast.success("Signed in!");
            setSignInModalOpen(false);
        }
    }

    const signUp = async (e: any) =>
    {
        e.preventDefault();
        const username = e.target.elements.username.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirmPassword.value;
        if(password !== confirmPassword)
        {
            toast.error("Passwords do not match!");
            return;
        }

        const response = await supabase.auth.signUp({email: email, password: password, options:
                {
                    data:
                        {
                            display_name: username
                        }
                }});
        if(response.error)
        {
            toast.error("Failed to sign up!");
        }else
        {
            toast.success("Signed up!");
            setSignInModalOpen(false);
        }
    }

    return <Modal
            style={defaultModalStyle}
            isOpen={signInModalOpen}
            onRequestClose={() => setSignInModalOpen(false)}
            >
        <div className="p-10 bg-gray-800 text-gray-200">
            <div className="flex flex-row items-center mb-2">
                <h1 className="text-2xl font-bold">{formState}</h1>
                <button className="ml-auto hover:text-red-600 transition duration-100 ease-in-out"
                        onClick={() => setSignInModalOpen(false)}><IoIosCloseCircle className="w-6 h-6"/></button>
            </div>
            {formState === "Sign In" &&
                    <form className="flex flex-col gap-2" onSubmit={signIn}>
                        <div className="flex flex-col">
                            <label  className="font-semibold">Email</label>
                            <input className="p-1 text-black rounded-md" name="email" type="email"/>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">Password</label>
                            <input className="p-1 text-black rounded-md" name="password" type="password"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Don&apos;t have an account? <button
                                className="underline text-indigo-400 hover:text-indigo-300"
                                onClick={() => setFormState("Sign Up")}>Sign Up</button></p>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                className="font-semibold py-2 px-4 text-sm rounded-full bg-indigo-500 hover:bg-indigo-400"
                                type="submit">Sign In
                            </button>
                        </div>
                    </form>
            }
            {formState === "Sign Up" &&
                <form className="flex flex-col gap-2" onSubmit={signUp}>
                    <div className="flex flex-col">
                        <label className="font-semibold">Username</label>
                        <input className="p-1 text-black rounded-md" name="username" type="text"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Email</label>
                        <input className="p-1 text-black rounded-md" name="email" type="email"/>
                    </div>
                    <div className="flex flex-col mt-2">
                        <label className="font-semibold">Password</label>
                        <input className="p-1 text-black rounded-md" name="password" type="password"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Confirm Password</label>
                        <input className="p-1 text-black rounded-md" name="confirmPassword" type="password"/>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Already have an account? <button
                            className="underline text-indigo-400 hover:text-indigo-300"
                            onClick={() => setFormState("Sign In")}>Sign In</button></p>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            className="font-semibold py-2 px-4 text-sm rounded-full bg-indigo-500 hover:bg-indigo-400"
                            type="submit">Sign Up
                        </button>
                    </div>
                </form>
            }
        </div>
    </Modal>
}