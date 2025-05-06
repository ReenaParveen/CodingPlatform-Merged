// components/CodeEditor.jsx

export default function CodeEditor({ code, setCode }) {
  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      rows={12}
      className="w-full border p-2 mt-2 font-mono"
    />
  );
}
