import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { assets } from "@/assets/asset";
import axios from "axios";


const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/v1/user/register", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setInput({ username: "", fullName: "", email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 dark:bg-black">
      <div className="flex w-full max-w-5xl justify-center items-center gap-12">
        {/* Left Side Image */}
        <div className="hidden md:block">
          <img
            src={assets.Instagram}
            alt="Instagram demo"
            className="w-[30rem] h-[25rem]"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full max-w-sm">
          <div className="bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 p-8 rounded-md text-center">
            <h1 className="text-4xl satisfy-regular mb-5">Instagram</h1>

            {/* <div  className="mb-4 w-80 flex items-center justify-center gap-3 text-blue-500 font-bold text-[14px]">
             <BsGoogle /> 
             <p>Log in with Google</p>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-neutral-900 px-2 text-gray-500 dark:text-gray-400">OR</span>
              </div>
            </div> */}

            <form onSubmit={signupHandler} className="space-y-3">
              <Input
                name="email"
                placeholder="Mobile Number or Email"
                value={input.email}
                onChange={changeHandler}
              />
              <Input
                name="fullName"
                placeholder="Full Name"
                value={input.fullName}
                onChange={changeHandler}
              />
              <Input
                name="username"
                placeholder="Username"
                value={input.username}
                onChange={changeHandler}
              />
              <Input
                name="password"
                placeholder="Password"
                type="password"
                value={input.password}
                onChange={changeHandler}
              />
              <Button type="submit" className="w-full bg-blue-500">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              By signing up, you agree to our Terms , Privacy Policy and Cookies Policy.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-neutral-700 mt-4 p-4 text-center text-sm">
            Have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
