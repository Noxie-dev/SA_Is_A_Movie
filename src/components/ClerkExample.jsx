import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

/**
 * Example component demonstrating proper Clerk usage
 * This follows the official Clerk React Quickstart guidelines
 */
export default function ClerkExample() {
  return (
    <header className="p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clerk Authentication Example</h1>
        
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
