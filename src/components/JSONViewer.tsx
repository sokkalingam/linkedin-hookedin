'use client';

interface JSONViewerProps {
  data: any;
}

export default function JSONViewer({ data }: JSONViewerProps) {
  const syntaxHighlight = (json: string) => {
    // Replace with colored spans
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'text-orange-600'; // numbers
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-linkedin font-medium'; // keys
          } else {
            cls = 'text-green-600'; // string values
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-orange-600'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-gray-500'; // null
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  const jsonString = JSON.stringify(data, null, 2);
  const highlighted = syntaxHighlight(jsonString);

  return (
    <pre
      className="text-xs font-mono overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
