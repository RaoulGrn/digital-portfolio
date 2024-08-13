export const highlightText = (text, query) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={index}
        className="bg-teal-600 rounded-md px-1 py-0.5 text-white"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};
