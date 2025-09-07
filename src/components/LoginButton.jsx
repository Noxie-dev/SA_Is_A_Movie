import React from "react";
import { Button } from "@/components/ui/button";
import { Edit3, LogIn } from "lucide-react";

const LoginButton = () => {
  const handleCMSAccess = () => {
    // Redirect to the CMS admin panel
    window.location.href = '/admin/';
  };

  return (
    <Button 
      onClick={handleCMSAccess}
      className="saisa-bg-yellow text-black font-bold px-6 py-2 rounded-xl hover:bg-yellow-300 transition-all duration-300"
    >
      <Edit3 className="mr-2 h-4 w-4" />
      Blog CMS
    </Button>
  );
};

export default LoginButton;



