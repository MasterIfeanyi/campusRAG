/**
 * Parses inline formatting for text:
 * - Bold: **text** or *text* (rendered as <strong className="font-bold">)
 * - Italics: _text_
 * - Inline Code: `code`
 * - Markdown links: [text](url)
 */
export function parseInlineFormatting(text, keyPrefix = "inline") {
  if (!text) return null;

  // Regex matching:
  // 1) Markdown links: [text](url)
  // 2) Inline code: `code`
  // 3) Double asterisk bold: **text**
  // 4) Single asterisk bold: *text* (or * text *)
  // 5) Underscore italics: _text_
  const combinedRegex = /(\[(.+?)\]\((https?:\/\/[^\s)]+)\))|(`([^`]+)`)|(\*\*(.+?)\*\*)|(\*([^\*\n]+?)\*)|(_([^_\n]+?)_)/g;

  const elements = [];
  let lastIndex = 0;
  let match;
  let count = 0;

  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const key = `${keyPrefix}-${count++}`;

    if (match[1]) {
      // Markdown link: [text](url)
      const linkText = match[2];
      const linkUrl = match[3];
      elements.push(
        <a
          key={key}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {linkText}
        </a>
      );
    } else if (match[4]) {
      // Inline code `code`
      const codeText = match[5];
      elements.push(
        <code key={key} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono font-semibold text-primary">
          {codeText}
        </code>
      );
    } else if (match[6] || match[8]) {
      // Bold (**text** or *text*)
      const boldText = (match[7] || match[9] || "").trim();
      elements.push(
        <strong key={key} className="font-bold text-foreground dark:text-white">
          {parseInlineFormatting(boldText, `${key}-nested`)}
        </strong>
      );
    } else if (match[10]) {
      // Italic (_text_)
      const italicText = match[11];
      elements.push(
        <em key={key} className="italic text-foreground/90">
          {parseInlineFormatting(italicText, `${key}-nested`)}
        </em>
      );
    }

    lastIndex = combinedRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

/**
 * Parses full AI answer text into structured React blocks (headings, paragraphs, lists)
 */
export function renderFormattedAnswer(answerText) {
  if (!answerText) return null;

  const lines = answerText.split(/\r?\n/);
  const blocks = [];
  let currentList = null;
  let blockKey = 0;

  const flushList = () => {
    if (!currentList) return;
    const isUl = currentList.type === "ul";
    const ListTag = isUl ? "ul" : "ol";
    const listClass = isUl
      ? "list-disc pl-5 space-y-2 my-3 text-foreground dark:text-gray-100"
      : "list-decimal pl-5 space-y-2 my-3 text-foreground dark:text-gray-100";

    blocks.push(
      <ListTag key={`list-${blockKey++}`} className={listClass}>
        {currentList.items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {parseInlineFormatting(item, `li-${blockKey}-${idx}`)}
          </li>
        ))}
      </ListTag>
    );
    currentList = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Check for headings: # Heading, ## Heading, ### Heading
    const headerMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      flushList();
      const level = headerMatch[1].length;
      const titleText = headerMatch[2];
      const headerClasses =
        level === 1
          ? "text-xl font-bold text-foreground dark:text-white mt-5 mb-2"
          : level === 2
          ? "text-lg font-bold text-foreground dark:text-white mt-4 mb-2"
          : "text-base font-bold text-foreground dark:text-white mt-3 mb-1";

      blocks.push(
        <div key={`h-${blockKey++}`} className={headerClasses}>
          {parseInlineFormatting(titleText, `h-${blockKey}`)}
        </div>
      );
      continue;
    }

    const bulletMatch = trimmed.match(/^[\-\*]\s+(.+)$/);
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);

    if (bulletMatch) {
      if (currentList && currentList.type !== "ul") flushList();
      if (!currentList) currentList = { type: "ul", items: [] };
      currentList.items.push(bulletMatch[1]);
    } else if (numberMatch) {
      if (currentList && currentList.type !== "ol") flushList();
      if (!currentList) currentList = { type: "ol", items: [] };
      currentList.items.push(numberMatch[2]);
    } else {
      flushList();
      blocks.push(
        <p key={`p-${blockKey++}`} className="mb-3 leading-relaxed text-foreground dark:text-gray-100 last:mb-0">
          {parseInlineFormatting(trimmed, `p-${blockKey}`)}
        </p>
      );
    }
  }

  flushList();

  return <div className="space-y-1">{blocks}</div>;
}
