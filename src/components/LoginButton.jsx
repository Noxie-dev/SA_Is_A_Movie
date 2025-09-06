import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button 
      onClick={() => loginWithRedirect()}
      className="saisa-bg-yellow text-black font-bold px-6 py-2 rounded-xl hover:bg-yellow-300 transition-all duration-300"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Log In
    </Button>
  );
};

export default LoginButton;


