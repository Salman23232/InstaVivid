import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setloading] = useState(false);
  const changeEventHandaler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="flex justify-center items-center w-screen h-screen font-bold">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4 text-center">
          <h1 className="font-extrabold text-4xl mb-5 satisfy-regular">
            Instavivid
          </h1>
          <p>Signup to see photos and videos from your friends</p>
        </div>
        <div>
          <Label className="font-medium">Username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandaler}
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandaler}
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label className="font-medium">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandaler}
            className="focus-visible:ring-transparent"
          />
        </div>
        <Button type="submit">Signup</Button>
        <span className="text-center">Already have an account? <Link className="text-blue-600" to='/login'>Login</Link></span>
      </form>
    </div>
  );
};

export default Signup;
