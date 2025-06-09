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
      const res = await axios.post("http://localhost:8000/api/v1/user/login", input, {
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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center px-4">
      <div className="flex w-full max-w-5xl justify-center items-center gap-12">
        {/* Left Side Image */}
        <div className="hidden md:block">
          <img
            src={assets.Instagram}
            alt="Instagram demo"
            className="w-[30rem] h-[25rem] object-contain"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-8 rounded-lg text-center shadow-sm">
            <h1 className="text-4xl satisfy-regular text-black dark:text-white mb-6">Instagram</h1>

            <form onSubmit={loginHandler} className="space-y-4">
              <Input
                name="email"
                placeholder="Email"
                type="email"
                value={input.email}
                onChange={changeHandler}
                className="dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400"
              />
              <Input
                name="password"
                placeholder="Password"
                type="password"
                value={input.password}
                onChange={changeHandler}
                className="dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400"
              />
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 mt-4 p-4 text-center text-sm text-black dark:text-white rounded-md">
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
