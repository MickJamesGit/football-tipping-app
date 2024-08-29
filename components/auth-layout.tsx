import Link from "next/link";
import SiteLogo from "@/components/site-logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2">
      {/* Header Section - Visible only on smaller screens */}
      <div className="w-full bg-primary py-5 flex justify-center lg:hidden">
        <div className="w-[350px] flex items-center justify-center">
          <SiteLogo />
        </div>
      </div>

      {/* Children Section - Centered on larger screens */}
      <div className="flex flex-col items-center justify-start mt-5 flex-grow  lg:py-0 lg:flex lg:items-center lg:justify-center lg:col-start-1">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2">{children}</div>
        </div>
      </div>

      {/* Right Side Section with Logo and Background - Visible only on larger screens */}
      <div className="hidden lg:flex bg-primary items-center justify-center lg:col-start-2">
        <div className="w-[350px] flex items-center justify-center">
          <SiteLogo />
        </div>
      </div>

      {/* Footer Section - Visible only on smaller screens */}
      <div className="w-full bg-primary py-4 lg:hidden">
        {/* Empty footer to maintain the space */}
      </div>
    </div>
  );
};

export default AuthLayout;
