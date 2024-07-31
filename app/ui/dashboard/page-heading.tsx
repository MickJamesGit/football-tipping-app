export default function PageHeading({ title }: { title: string }) {
  return (
    <div className="w-full bg-slate-50 p-4 rounded-lg flex items-center">
      <h1 className="text-2xl text-left ml-2">{title}</h1>
    </div>
  );
}
