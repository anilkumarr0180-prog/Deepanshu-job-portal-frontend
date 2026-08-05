import { FileText } from "lucide-react";

interface JobDescriptionSectionProps {
  description: string;
}

export default function JobDescriptionSection({
  description,
}: JobDescriptionSectionProps) {
  const paragraphs = description
    ? description.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    : [];

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5]">
          <FileText className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-[#05264E]">Job Description</h2>
      </div>

      <div className="mt-6">
        {paragraphs.length > 0 ? (
          <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-8">
            {paragraphs.map((paragraph, index) => {
              const lines = paragraph.split("\n").filter((l) => l.trim());

              if (lines.length > 1 && lines.every((l) => l.trim().startsWith("- ") || l.trim().startsWith("• "))) {
                return (
                  <ul key={index} className="space-y-2 list-disc pl-5">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx}>
                        {line.replace(/^[-•]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              );
            })}
          </div>
        ) : (
          <p className="text-sm italic text-slate-400">
            No detailed description provided for this position.
          </p>
        )}
      </div>
    </section>
  );
}
