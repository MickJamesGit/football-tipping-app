import { lusitana } from "@/app/ui/fonts";

export default function PageHeading({ title }: { title: string }) {
  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <h1 className={`${lusitana.className} text-2xl text-left`}>{title}</h1>
    </div>
  );
}
