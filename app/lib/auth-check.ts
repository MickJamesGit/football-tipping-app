import { redirect } from "next/navigation";
import { auth } from "../../auth"; // Adjust the import path according to your project structure

export const requireAuth = async () => {
  const session = await auth();
  if (!session) {
    return false;
  }
  return true;
};
