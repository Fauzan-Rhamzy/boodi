import BackArrow from "../components/BackArrow";
import bg from "../assets/bg-login.png";
import pfp from "../assets/dummy-pfp.png";
import BigProfile from "../components/BigProfile";
import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [preview, setPreview] = useState(pfp);
  const [file, setFile] = useState<File | null>(null);

  const [firstName, setFirstname] = useState<string>("");
  const [lastName, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  //   const [email, setDate] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [password, setPassword] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return toast.loading("wait");
    }
    const formData = new FormData();
    formData.append("pfp", file);

    try {
      toast.success("Photo uploaded");
    } catch (error) {
      toast.error("Failed to update image");
    }
  };
  return (
    <div
      className="w-full min-h-screen p-10"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <BackArrow />

      <div className="flex items-center justify-center h-64 mt-2">
        <BigProfile pfp={preview} />
      </div>

      <div className="flex items-center justify-center ">
        <label
          htmlFor="photoInput"
          className="bg-blue-500 text-white pl-2 pr-2 rounded-2xl hover:cursor-pointer"
        >
          Change Profile Picture
        </label>
        <input
          type="file"
          id="photoInput"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
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
        </form>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 hover:cursor-pointer"
          onClick={() => handleUpload()}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
