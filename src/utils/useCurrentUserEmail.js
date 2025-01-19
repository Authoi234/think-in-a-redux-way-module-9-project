import { useSelector } from "react-redux";

// Custom hook to get the current user's email
export const useCurrentUserEmail = () => {
  const { user } = useSelector((state) => state.auth) || {};
  return user?.email || ""; // Return email or empty string if no user
};