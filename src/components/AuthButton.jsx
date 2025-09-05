import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import LoginButton from "./LoginButton";
import Profile from "./Profile";

const AuthButton = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-600 rounded animate-pulse"></div>
      </div>
    );
  }

  return isAuthenticated ? <Profile /> : <LoginButton />;
};

export default AuthButton;

