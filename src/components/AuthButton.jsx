import React from "react";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";

const AuthButton = () => {
  // Show both login and signup buttons for CMS access
  return (
    <div className="flex items-center space-x-3">
      <LoginButton />
      <SignupButton />
    </div>
  );
};

export default AuthButton;



