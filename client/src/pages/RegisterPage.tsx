import { Eye, EyeOff } from "lucide-react";
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
      <div className="w-full min-h-screen p-10 bg-bw">
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
          <h2 className="text-8xl font-bold tracking-tight text-text font-caveat">
            Register
          </h2>
        </div>

        <div className="mt-3 mb-3">
          <span className=" text-text text-sm">
            Create an account to continue!
          </span>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm/6 font-medium text-gray-900"
              >
                First Name <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  required
                  //   autoComplete=""
                  className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                  className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Phone Number <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="mt-2 ">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry="ID"
                  className="flex w-full items-center rounded-xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:shadow-md focus-within:shadow-indigo-50 sm:text-sm/6 [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:relative [&_.PhoneInputCountry]:mr-3 [&_.PhoneInputCountry]:pr-3 [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-gray-200 [&_.PhoneInputCountrySelect]:absolute [&_.PhoneInputCountrySelect]:top-0 [&_.PhoneInputCountrySelect]:left-0 [&_.PhoneInputCountrySelect]:w-full [&_.PhoneInputCountrySelect]:h-full [&_.PhoneInputCountrySelect]:opacity-0 [&_.PhoneInputCountrySelect]:cursor-pointer [&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-auto [&_.PhoneInputCountryIcon]:rounded-sm [&_.PhoneInputCountryIcon]:object-cover [&_.PhoneInputCountryIcon]:shadow-sm [&_.PhoneInputCountrySelectArrow]:border-t-gray-400 [&_.PhoneInputCountrySelectArrow]:border-t-4 [&_.PhoneInputCountrySelectArrow]:border-x-transparent [&_.PhoneInputCountrySelectArrow]:border-x-4 [&_.PhoneInputCountrySelectArrow]:ml-1.5 [&_.PhoneInputCountrySelectArrow]:opacity-70 [&_input]:w-full [&_input]:bg-transparent [&_input]:outline-none [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400 [&_input]:font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password <span className="text-red-500 ml-0.5">*</span>
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
                  type={hidePassword ? "password" : "text"}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 pr-10"
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

            {error && (
              <div className="rounded-xl bg-red-50 px-3 py-2">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-[20px] bg-dark-green px-3 py-2 text-sm/6 font-semibold text-white hover:bg-dark-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 hover:cursor-pointer mt-6"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-2 text-center text-sm/6 text-gray-500">
            Already have an account?{" "}
            <a
              //   href="/login"
              onClick={() => navigate("/login")}
              className="font-bold text-dark-green hover:text-dark-green hover:cursor-pointer"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
