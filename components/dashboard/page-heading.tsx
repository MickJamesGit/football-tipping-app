export default function PageHeading({ title }: { title: string }) {
  return (
    <h1 className="bg-primary py-4 px-6 font-bold tracking-tight rounded-lg text-3xl text-primary-foreground">
      {title}
    </h1>
  );
}
