import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import LogoutButton from "./LogoutButton";
import { useClerkAuth } from "@/hooks/useClerkAuth";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useClerkAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-600 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      <Card className="bg-[#0A0A2A]/50 border-[#FFA500]/30">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback className="bg-[#FFA500] text-black font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="text-white font-semibold">{user?.name}</div>
              <div className="text-gray-400 text-xs">{user?.email}</div>
              {user?.metadata && Object.keys(user.metadata).length > 0 && (
                <div className="text-[#FFA500] text-xs mt-1">
                  Metadata: {Object.keys(user.metadata).length} items
                </div>
              )}
            </div>
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
