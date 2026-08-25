import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface UserProfileTarget {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  profilePicture?: string;
  headline?: string;
  city?: string;
  location?: string;
}

interface UserProfileContextType {
  targetUser: UserProfileTarget | null;
  isOpen: boolean;
  openUserProfile: (user: UserProfileTarget) => void;
  closeUserProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [targetUser, setTargetUser] = useState<UserProfileTarget | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openUserProfile = useCallback((user: UserProfileTarget) => {
    if (!user || !user._id) return;
    setTargetUser(user);
    setIsOpen(true);
  }, []);

  const closeUserProfile = useCallback(() => {
    setIsOpen(false);
    // Keep targetUser momentarily for smooth exit animation transition
    setTimeout(() => {
      setTargetUser(null);
    }, 200);
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        targetUser,
        isOpen,
        openUserProfile,
        closeUserProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfileModal() {
  const context = useContext(UserProfileContext);
  if (!context) {
    return {
      targetUser: null,
      isOpen: false,
      openUserProfile: () => {},
      closeUserProfile: () => {},
    };
  }
  return context;
}
