import axios from "axios";

export const signupUser = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/users/register",
      formData
    );
    console.log("User registered successfully:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};
