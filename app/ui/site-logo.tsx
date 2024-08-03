import { lusitana } from "@/app/ui/fonts";
import { FaTrophy } from "react-icons/fa";

export default function SiteLogo() {
  return (
    <div className={`${lusitana.className} flex flex-row leading-none`}>
      <FaTrophy
        className="mr-2 text-white"
        style={{ fontSize: "32px", minWidth: "30px", minHeight: "30px" }}
      />
      <p className="text-[32px] font-bold flex items-baseline">
        <span className="text-white">Predict</span>
        <span className="text-yellow-500">ory</span>
        <span className="text-white text-xs">.com.au</span>
      </p>
    </div>
  );
}
