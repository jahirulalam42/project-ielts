import React from "react";

type FormattedInstructionsProps = {
  instructions?: string;
  className?: string;
};

// Render instructions with preserved line breaks and two-column rules formatting.
// It detects rows like "TRUE\tif ..." and splits into a label and description.
const FormattedInstructions: React.FC<FormattedInstructionsProps> = ({
  instructions,
  className,
}) => {
  if (!instructions || typeof instructions !== "string") {
    return null;
  }

  // Normalize line endings and trim leading/trailing blank lines
  const lines = instructions
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd());

  // Inline formatter: supports [b]...[/b] tags for manual bolding
  const renderInline = (text: string) => {
    if (!text) return text;
    const parts: Array<string | JSX.Element> = [];
    const regex = /\[b\]([\s\S]*?)\[\/b\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(<strong key={parts.length}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length ? parts : text;
  };

  // Build blocks: a top free-text block and then key-value rows if detected
  const rows: Array<{ label: string; text: string } | { text: string }> = [];

  const pushRow = (label: string | null, text: string) => {
    if (label) {
      rows.push({ label, text });
    } else if (text.trim() !== "") {
      rows.push({ text });
    }
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;

    // Try to split on tabs first; if no tabs, split on 2+ spaces once
    let label: string | null = null;
    let text = "";

    if (line.includes("\t")) {
      const [l, ...rest] = line.split(/\t+/);
      if (rest.length) {
        label = l.trim();
        text = rest.join(" ").trim();
      }
    }

    if (!label) {
      const match = line.match(/^(\S[\S ]*?)[ ]{2,}(.*)$/);
      if (match) {
        label = match[1].trim();
        text = (match[2] || "").trim();
      }
    }

    if (label) {
      pushRow(label, text);
    } else {
      pushRow(null, line);
    }
  });

  // Separate the leading free-text (no label) paragraphs from labeled rows
  const firstLabeledIndex = rows.findIndex((r: any) => r.label);
  const preface = firstLabeledIndex === -1 ? rows : rows.slice(0, firstLabeledIndex);
  const labeled = firstLabeledIndex === -1 ? [] : (rows.slice(firstLabeledIndex) as Array<{label: string; text: string}>);

  return (
    <div className={className}>
      {preface.length > 0 && (
        <div className="whitespace-pre-line text-gray-700 text-sm mb-2">
          {preface.map((p, idx) => (
            <p key={idx} className={idx > 0 ? "mt-1" : undefined}>
              {"text" in p ? renderInline(p.text) : ""}
            </p>
          ))}
        </div>
      )}

      {labeled.length > 0 && (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-[140px_minmax(0,1fr)] text-sm">
          {labeled.map((r, idx) => (
            <React.Fragment key={`${r.label}-${idx}`}>
              <div className="font-bold uppercase tracking-wide text-gray-900">
                {renderInline(r.label)}
              </div>
              <div className="text-gray-700">{renderInline(r.text)}</div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormattedInstructions;


