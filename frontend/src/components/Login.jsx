import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/Authslice";
import { assets } from "@/assets/asset";
import { BsGoogle } from "react-icons/bs";
import api from "@/api";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/user/login", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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

            {/* <div className="mb-4 w-80 flex items-center justify-center gap-3 text-blue-500 font-bold text-[14px]">
              <BsGoogle />
              <p>Log in with Google</p>
            </div> */}
{/* 
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-neutral-900 px-2 text-gray-500 dark:text-gray-400">
                  OR
                </span>
              </div>
            </div> */}

            <form onSubmit={loginHandler} className="space-y-3">
              <Input
                name="email"
                placeholder="Email"
                type="email"
                value={input.email}
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
                  "Log In"
                )}
              </Button>
            </form>
          </div>

          <div className="bg-gray-50 dark:bg-neutral-700 mt-4 p-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;