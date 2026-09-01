import BackArrow from "../components/BackArrow";
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

  const [originalFirstName, setOriginalFirstname] = useState<string>("");
  const [firstName, setFirstname] = useState<string>("");

  const [originalLastName, setOriginalLastname] = useState<string>("");
  const [lastName, setLastname] = useState<string>("");

  const [originalPhoneNumber, setOriginalPhoneNumber] = useState<
    string | undefined
  >("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");

  useEffect(() => {
    if (!user) return;
    const fetchUserProfile = async () => {
      const data = await getUserProfile(user?.user_id);

      setOriginalFirstname(data.first_name || "");
      setFirstname(data.first_name || "");

      setOriginalLastname(data.last_name || "");
      setLastname(data.last_name || "");

      setOriginalPhoneNumber(data.phone || "");
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
      setFirstname(originalFirstName || "");
      setLastname(originalLastName || "");
      setPhoneNumber(originalPhoneNumber || "");
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

  const changesMade =
    originalFirstName !== firstName ||
    originalLastName !== lastName ||
    originalPhoneNumber !== phoneNumber ||
    file;

  return (
    <div className="w-full min-h-screen p-10 bg-bw">
      <BackArrow backPath="/profile" />

      <div className="flex items-center justify-center h-64 mt-2">
        <BigProfile pfp={preview} />
      </div>

      <div className="flex items-center justify-center ">
        <label
          htmlFor="photoInput"
          className="bg-dark-green py-2 px-2 text-white text-sm pl-2 pr-2 rounded-[20px] hover:cursor-pointer"
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
            <label htmlFor="firstName" className="block text-sm/6 font-bold">
              First Name <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-1">
              <input
                id="firstName"
                name="firstName"
                required
                //   autoComplete=""
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  sm:text-sm/6"
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm/6 font-bold">
              Last Name <span className="italic text-gray-400">(optional)</span>
            </label>

            <div className="mt-1">
              <input
                id="lastName"
                name="lastName"
                //   autoComplete=""
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                value={lastName}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm/6 font-bold">
              Phone Number <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-1">
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
        </form>
      </div>
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          disabled={!changesMade}
          onClick={handleCancel}
          className={`w-1/2 border-2 border-dark-green py-2 rounded-md hover:bg-gray-300 transition-colors font-bold text-dark-green ${!changesMade && "opacity-50"} hover:cursor-pointer`}
        >
          Cancel
        </button>
        <button
          disabled={!changesMade}
          className={`w-full bg-dark-green text-white py-2 rounded-md font-medium hover:cursor-pointer ${!changesMade && "opacity-50"}`}
          onClick={(e) => handleSaveChanges(e)}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
