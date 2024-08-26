export default function PageHeading({ title }: { title: string }) {
  return (
    <h1 className="bg-primary py-4 px-6 rounded-lg text-2xl font-bold text-primary-foreground">
      {title}
    </h1>
  );
}
