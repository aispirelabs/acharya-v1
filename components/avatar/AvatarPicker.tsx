"use client";

import { useState } from "react";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import AvatarModal from "@/components/avatar/AvatarModal";
import { updateUserAvatar } from "@/lib/actions/auth.action"; // Stays the same

interface AvatarPickerProps {
  currentAvatar: string; // Will receive photo_url
  userId: string; // Still useful for alt text or other non-auth purposes
  userName: string; // For alt text
}

const AvatarPicker = ({ currentAvatar, userId, userName }: AvatarPickerProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(currentAvatar);

  const handleAvatarChange = async (newAvatar: string) => {
    setAvatar(newAvatar);
    setIsModalOpen(false);
    
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.error("You are not authenticated. Please sign in.");
        // Optionally redirect to login or handle appropriately
        return;
      }

      const result = await updateUserAvatar({
        // userId is not strictly needed by the refactored updateUserAvatar action,
        // as user is identified by token. But photoURL is.
        photoURL: newAvatar,
        accessToken: accessToken
      });
      
      if (result.success) {
        toast.success("Your avatar updated successfully!");
        // Optionally, if result.user contains the updated user, you might want to
        // update a global user state/context here.
      } else {
        toast.error(result.error || "Failed to update avatar.");
      }
    } catch (error) {
      console.error("Failed to update avatar:", error);
      toast.error("An unexpected error occurred while updating avatar.");
    }
  };

  return (
    <>
      <div 
        className="bg-dark-200 rounded-full p-0.5 border border-primary-200/30 relative cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative">
          <Image 
            src={avatar || '/user-avatar.jpg'} // Fallback if avatar is somehow null/empty
            alt={`${userName}'s avatar`} 
            width={40} 
            height={40} 
            className="rounded-full object-cover size-[40px]"
          />
          
          {isHovering && (
            <div className="absolute inset-0 bg-dark-200/70 rounded-full flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-primary-200" />
            </div>
          )}
          
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-dark-300 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Change avatar
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AvatarModal 
          currentAvatar={avatar}
          onSelect={handleAvatarChange}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default AvatarPicker;