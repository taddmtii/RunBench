export default function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border text-lg font-bold text-muted-foreground">
        {number}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
