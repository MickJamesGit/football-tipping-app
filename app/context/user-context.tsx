// context/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

type User = {
  id: string;
  username: string;
  image: string;
  name: string;
} | null;

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<User>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const { id, username, image, name } = session.user as {
        id?: string;
        username?: string;
        image?: string;
        name?: string;
      };

      // Only set user state if the values have changed
      if (
        id !== user?.id ||
        username !== user?.username ||
        image !== user?.image ||
        name !== user?.name
      ) {
        setUser({
          id: id ?? "",
          username: username ?? "",
          image: image ?? "",
          name: name ?? "",
        });
      }
    }
  }, [session, status, user]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
