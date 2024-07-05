import { lusitana } from "@/app/ui/fonts";
import { FaTrophy } from "react-icons/fa";

export default function SiteLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none`}
    >
      <FaTrophy
        className="mr-2 font-white"
        style={{ fontSize: "32px", minWidth: "32px", minHeight: "32px" }}
      />
      <p className="text-[32px] font-bold">
        <span className="text-white">Footy</span>
        <span className="text-yellow-500">Tips</span>
      </p>
    </div>
  );
}
