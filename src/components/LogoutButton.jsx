import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button 
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      variant="outline"
      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 px-6 py-2 rounded-xl"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log Out
    </Button>
  );
};

export default LogoutButton;

