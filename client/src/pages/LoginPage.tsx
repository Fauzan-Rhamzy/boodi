import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import BackArrow from "../components/BackArrow";
import { useNavigate } from "react-router";
import { login } from "../features/auth/api";
import { useAuth } from "../features/auth/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [error, setError] = useState("");

  const { refetch } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    // console.log(email, password);
    e.preventDefault();
    // if (!email) return setError("Input ")

    try {
      await login({ email, password });
      await refetch();
      toast.success("You're logged in");
      navigate("/home");
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data || "Failed to login");
    }
  };
  return (
    <>
      <div className="w-full min-h-screen p-10 bg-bw">
        <BackArrow />

        <div className="">
          {/* <div className="sm:mx-auto sm:w-full sm:max-w-sm pt-12 px-4"> */}
          <div className="pt-50">
            <h2 className="text-6xl font-bold tracking-tight text-text font-caveat">
              Sign In
            </h2>
            <h3 className="text-2xl text-text font-bold">to your account</h3>
          </div>

          <div className="mt-3 mb-3">
            <span className=" text-text text-sm">
              Enter your email and password to log in
            </span>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleLogin} className="space-y-2">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value.replace(/\s/g, ""))
                    }
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    {/* <a
                    href="#"
                    className="font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </a> */}
                  </div>
                </div>
                <div className="relative flex items-center mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "password" : "text"}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 pr-10"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 px-3 py-2">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-[20px] bg-dark-green px-3 py-2 text-sm/6 font-semibold text-white hover:bg-dark-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 hover:cursor-pointer mt-6"
                >
                  Log In
                </button>
              </div>
            </form>

            <p className="mt-2 text-center text-sm/6 text-gray-500">
              Don't have an account?{" "}
              <a
                // href="/register"
                onClick={() => navigate("/register")}
                className="font-bold text-dark-green hover:text-dark-green hover:cursor-pointer"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
