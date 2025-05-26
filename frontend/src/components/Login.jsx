import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunks";
import { clearError } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  isRequired,
  isEmail,
  minLength,
  composeValidators,
} from "../utils/validators";
export default function Login() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const emailValidator = composeValidators(isRequired, isEmail);
    const passwordValidator = composeValidators(isRequired, minLength(6));

    const newErrors = {
      email: emailValidator(email),
      password: passwordValidator(password),
    };

    Object.keys(newErrors).forEach(
      (key) => newErrors[key] === null && delete newErrors[key]
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser({ email, password }));
  };
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) dispatch(clearError());
              setErrors((prev) => ({ ...prev, email: null }));
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) dispatch(clearError());
              setErrors((prev) => ({ ...prev, password: null }));
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <br></br>
        <div className="mt-6 space-y-3">
          {[
            { label: "Demo CSR", email: "csr@amp.com" },
            { label: "Demo Manager", email: "manager@amp.com" },
            { label: "Demo Admin", email: "admin@amp.com" },
          ].map(({ label, email }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setEmail(email);
                setPassword("123456");
                dispatch(loginUser({ email, password: "123456" }));
              }}
              className={`w-full py-2 rounded-md text-white font-semibold transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
        )}
      </form>
    </div>
  );
}
