import BackArrow from "../components/BackArrow";
import bg from "../assets/bg-editProfile.png";
import pfp from "../assets/dummy-pfp.png";
import BigProfile from "../components/BigProfile";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import toast from "react-hot-toast";
import { useAuth } from "../features/auth/AuthContext";
import { getUserProfile, updateProfile } from "../api/users";

export default function ProfilePage() {
  const { user, refetch } = useAuth();

  const defaultPfp = `http://localhost:8080/images/${user?.profile_picture}`;
  const [preview, setPreview] = useState(
    user?.profile_picture ? defaultPfp : pfp,
  );
  const [file, setFile] = useState<File | null>(null);

  const [firstName, setFirstname] = useState<string>("");
  const [lastName, setLastname] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");

  useEffect(() => {
    if (!user) return;
    const fetchUserProfile = async () => {
      const data = await getUserProfile(user?.user_id);
      setFirstname(data.first_name || "");
      setLastname(data.last_name || "");
      console.log(data);
      setPhoneNumber(data.phone || "");
    };

    fetchUserProfile();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCancel = () => {
    if (user) {
      setFirstname(user?.first_name || "");
      // setLastname(user.?last_name || "");
      // setPhoneNumber(user.?phoneNumber || "");
    }
    setFile(null);
    setPreview(defaultPfp);
    toast.success("Changes cancelled");
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (firstName.trim() === "") {
      toast.error("First name should not be empty");
      return;
    }

    if (phoneNumber?.length && phoneNumber?.length < 7) {
      toast.error("Phone number is too short");
      return;
    }
    const loading = toast.loading("Saving changes...");

    const formData = new FormData();

    if (file) {
      formData.append("pfp", file);
    }

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("phone_number", phoneNumber || "");

    try {
      await updateProfile(user?.user_id, formData);
      toast.dismiss(loading);
      refetch();
      toast.success("Profile updated");
      setFile(null);
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to update profile");
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
      <BackArrow backPath="/home" />

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
              First Name <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                required
                //   autoComplete=""
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Last Name <span className="italic text-gray-400">(optional)</span>
            </label>

            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                //   autoComplete=""
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={lastName}
                onChange={(e) => setLastname(e.target.value)}
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
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="w-1/2 bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 hover:cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 hover:cursor-pointer"
          onClick={(e) => handleSaveChanges(e)}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
