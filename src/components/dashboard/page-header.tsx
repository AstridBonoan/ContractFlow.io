export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-600 sm:text-base">{description}</p>}
    </div>
  );
}
