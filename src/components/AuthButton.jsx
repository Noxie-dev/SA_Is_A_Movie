import React from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";

const AuthButton = () => {
  return (
    <div className="flex items-center space-x-3">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="saisa-bg-yellow text-black font-bold px-6 py-2 rounded-xl hover:bg-yellow-300 transition-all duration-300">
            Login
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-black transition-all duration-300 px-6 py-2 rounded-xl border-2">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "bg-[#0A0A2A] border-[#FFA500]/30",
              userButtonPopoverActionButton: "text-white hover:bg-[#FFA500]/20",
              userButtonPopoverActionButtonText: "text-white",
              userButtonPopoverFooter: "hidden"
            }
          }}
        />
      </SignedIn>
    </div>
  );
};

export default AuthButton;



