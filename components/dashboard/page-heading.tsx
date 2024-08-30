export default function PageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="pb-2">
      {" "}
      <h1 className="text-3xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
