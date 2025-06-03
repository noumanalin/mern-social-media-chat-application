import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

interface UserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/auth/user/register`,
        {
          userName: userData.fullName,
          email: userData.email,
          password: userData.password,
        },
        { withCredentials: true }
      );

      if (response.status === 201 || response.data?.success) {
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong!";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <section className="p-3 rounded-md w-[35rem] bg-gray-100">
      <h2 className="text-2xl text-primary font-bold">Sign Up</h2>
      <p className={`${error ? "" : "hidden"} bg-red-500 text-gray-300 px-1 my-2`}>
        {error}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
        <input
          className="border-none outline-none p-2 rounded-sm bg-gray-200"
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={userData.fullName}
          onChange={handleChange}
        />
        <input
          className="border-none outline-none p-2 rounded-sm bg-gray-200"
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
        />

        <label className="flex justify-between p-2 rounded-sm bg-gray-200">
          <input
            className="flex-1 border-none outline-none"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
          />
          <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </label>

        <label className="flex justify-between p-2 rounded-sm bg-gray-200">
          <input
            className="flex-1 border-none outline-none"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={userData.confirmPassword}
            onChange={handleChange}
          />
          <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </label>

        <button
          type="submit"
          className="bg-primary px-4 py-2 text-gray-300 w-fit my-5 rounded-sm font-bold"
        >
          Register
        </button>
      </form>
      <p className="font-semibold text-gray-700">
        Already have an account? <Link className="text-primary" to={"/login"}>Sign In</Link>
      </p>
    </section>
  );
};

export default Signup;
