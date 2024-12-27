import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Signup = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen font-bold">
      <form action="" className="shadow-lg flex flex-col gap-5 p-8">
        <div className="my-4 text-center">
          <h1 className="font-extrabold text-4xl mb-5 satisfy-regular">Instavivid</h1>
          <p>Signup to see photos and videos from your friends</p>
        </div>
        <div>
          <Label className="font-medium">Username</Label>
          <Input type="text" className="focus-visible:ring-transparent" />
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input type="text" className="focus-visible:ring-transparent" />
        </div>
        <div>
          <Label className="font-medium">Password</Label>
          <Input type="text" className="focus-visible:ring-transparent" />
        </div>
        <Button>Signup</Button>
      </form>
    </div>
  );
};

export default Signup;
