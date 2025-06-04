import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/user-slice";

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when typing
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/auth/user/login`,
        formData,
        { withCredentials: true }
      );

      if (response.data?.success) {
        const { user, token } = response.data;
        
        // Dispatch login success with both user and token
        dispatch(loginSuccess({ user, token }));
        
        // Store in localStorage if rememberMe is checked
        if (formData.rememberMe) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem("token", token);
        } else {
          // Use sessionStorage for temporary session
          sessionStorage.setItem("currentUser", JSON.stringify(user));
          sessionStorage.setItem("token", token);
        }

        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-3 rounded-md w-[35rem] bg-gray-100">
      <h2 className="text-2xl text-primary font-bold">Login</h2>
      <p className={`${error ? "" : "hidden"} bg-red-500 text-gray-300 px-1 my-2`}>
        {error}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
        <input
          className="border-none outline-none p-2 rounded-sm bg-gray-200"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <div className="relative">
          <input
            className="border-none outline-none p-2 rounded-sm bg-gray-200 w-full"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="text-right text-gray-700">
          <input
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="accent-primary mr-1"
          />
          <label htmlFor="rememberMe" className="cursor-pointer">
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary px-4 py-2 text-gray-300 w-fit my-5 rounded-sm font-bold"
        >
          Login
        </button>
      </form>
      <p className="font-semibold text-gray-700">
        Don't have an account?{" "}
        <Link className="text-primary" to={"/signup"}>
          Sign Up
        </Link>
      </p>
    </section>
  );
};

export default Login;
