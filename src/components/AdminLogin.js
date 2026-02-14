import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginHeader } from "./LoginHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE =  process.env.REACT_APP_API_BASE ;

const schema = Yup.object({
  username: Yup.string().trim().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      setIsLoading(true);
      
      try {
        const response = await axios.post(
          `${API_BASE}/admin/login`,
          
          {
            username: values.username,
            password: values.password,
          }
        );

        if (response.data.success) {
          // Store token and admin data in localStorage
          localStorage.setItem("adminToken", response.data.token);
          localStorage.setItem("adminData", JSON.stringify(response.data.admin));

          // Show success message
          toast.success("Login successful!");

          // Small delay to ensure localStorage is set before navigation
          setTimeout(() => {
            navigate("/dashboard");
          }, 100);
        }
      } catch (error) {
        console.error("Login error:", error);
        
        if (error.response) {
          // Server responded with error
          toast.error(error.response.data.message || "Invalid credentials");
        } else if (error.request) {
          // Request made but no response
          toast.error("Cannot connect to server. Please try again.");
        } else {
          // Other errors
          toast.error("Login failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const fieldBase =
    "w-full rounded-xl bg-[#F0EDFFCC] px-14 py-3 text-md outline-none ring-1 ring-transparent " +
    "focus:bg-white focus:ring-indigo-200 transition placeholder:text-[#1C1C1C]";

  return (
    <div>
      <LoginHeader />
      <div className="min-h-screen w-full bg-white flex items-center justify-center font-poppins p-4">
        {/* Outer container */}
        <div className="w-full max-w-6xl rounded-3xl bg-white overflow-hidden">
          <div className="flex gap-[120px]">
            {/* LEFT CARD */}
            <img
              className="lg:w-[450px] lg:h-[480px]"
              src="/images/admin_login_img.webp"
              alt="Admin Login"
            />

            {/* RIGHT FORM */}
            <div className="p-8 md:p-12 flex items-center">
              <div className="w-full max-w-md mx-auto">
                <h1 className="lg:text-[60px] font-bold tracking-tight text-gray-900">
                  ADMIN LOGIN
                </h1>
                <p className="mt-4 text-[20px] text-[#525252]">
                  How to i get started lorem ipsum dolor at?
                </p>

                <form onSubmit={formik.handleSubmit} className="mt-14 space-y-4">
                  {/* Username */}
                  <div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <img src="/images/person.svg" alt="Username"/>
                      </span>

                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className={fieldBase}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                      />
                    </div>
                    {formik.touched.username && formik.errors.username ? (
                      <p className="mt-1 text-xs text-red-600">
                        {formik.errors.username}
                      </p>
                    ) : null}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <img src="/images/password.svg" alt="Password"/>
                      </span>

                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className={fieldBase}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                      />
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <p className="mt-1 text-xs text-red-600">
                        {formik.errors.password}
                      </p>
                    ) : null}
                  </div>

                  {/* Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-44 mx-auto block rounded-2xl py-3 text-[16px] font-semibold text-white
                      bg-gradient-to-r from-[#FFFF00] via-[#7158B6] to-[#7158B6]
                      hover:brightness-105 active:scale-[0.99] transition
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Logging in..." : "Login Now"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
