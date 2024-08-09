import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const changeEventhandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const [loading, setloading] = useState(false);
  //const url = import.meta.env.VITE_URL;
  //console.log(url)
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(input)

      setloading(true);
      const res = await axios.post("/api/v1/user/register", input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setloading(false);
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center h-screen w-screen justify-center">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-2xl ">LOGO</h1>
          <p className="text-sm text-center">
            Signup to see photos & videos from your friends
          </p>
        </div>
        <div>
          <span>Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventhandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span>Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventhandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span>password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventhandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            please wait
          </Button>
        ) : (
          <Button type="submit"> Signup</Button>
        )}

        <span className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
