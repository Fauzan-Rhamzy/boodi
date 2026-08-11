import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import bg from "../assets/bg-register.png";
import React, { useState } from "react";
import BackArrow from "../components/BackArrow";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-number-input";
import { register } from "../features/auth/api";

export default function RegisterPage() {
  const [firstName, setFirstname] = useState<string>("");
  const [lastName, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  //   const [email, setDate] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState("");

  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email should not be empty");
      return;
    }
    if (!firstName.trim()) {
      setError("First name should not be empty");
      return;
    }
    // if (!password.trim()) {
    //   setError("Password should not be empty");
    //   return;
    // }
    if (password.length < 8) {
      setError("Password should at least be 8 characters long");
      return;
    }
    if (!phoneNumber) {
      setError("Phone should not be empty");
      return;
    }
    if (phoneNumber?.length && phoneNumber?.length < 7) {
      setError("Phone number is too short");
      return;
    }

    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName || "",
        phone: phoneNumber || "",
      });
      navigate("/login");
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data || "Failed to register");
    }
  };
  return (
    <>
      {/* <div
        className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      > */}
      <div
        className="w-full min-h-screen p-10"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* <div className="absolute top-6 left-6">
          <button
            type="button"
            className="flex items-center justify-center p-2 text-gray-700 hover:text-black transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="" />
          </button>
        </div> */}
        <BackArrow />

        <div className="pt-25">
          <h2 className="text-6xl font-bold tracking-tight text-black">
            Register
          </h2>
        </div>

        <div className="mt-3 mb-3">
          <span className=" text-gray-500">Create an account to continue!</span>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm/6 font-medium text-gray-900"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  required
                  //   autoComplete=""
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="lastName"
                  name="lastName"
                  //   autoComplete=""
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
            </div>

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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setEmail(e.target.value)}
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
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type={hidePassword ? "password" : "text"}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setHidePassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
                  aria-label={hidePassword ? "Hide password" : "Show password"}
                >
                  {hidePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  // autoComplete=""
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div> */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2 ">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry="ID"
                  className="flex w-full rounded-md bg-white px-3 py-1.5 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:text-sm/6 items-center
                    [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:mr-2 [&_.PhoneInputCountry]:pr-2 [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-gray-200
                    [&_.PhoneInputCountrySelect]:w-12 [&_.PhoneInputCountrySelect]:cursor-pointer
                    [&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-4 [&_.PhoneInputCountryIcon]:shadow-sm
                    [&_input]:w-full [&_input]:bg-transparent [&_input]:outline-none [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400 [&_input]:ml-1"
                />
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
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 hover:cursor-pointer"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already have an account?{" "}
            <a
              //   href="/login"
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:cursor-pointer"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
