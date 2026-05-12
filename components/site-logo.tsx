import { lusitana } from "@/public/fonts/fonts";
import { FaTrophy } from "react-icons/fa";

export default function SiteLogo() {
  return (
    <div
      className={`${lusitana.className} tracking-tight flex flex-row leading-none`}
    >
      <FaTrophy
        className="mr-1 text-yellow-400"
        style={{ fontSize: "30px", minWidth: "30px", minHeight: "30px" }}
      />

      <p className="text-[28px] font-bold flex items-baseline">
        <span className="text-white">Sports</span>
        <span className="text-yellow-400">Tippers</span>
      </p>
    </div>
  );
}
