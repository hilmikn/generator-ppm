import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

// Helper to highlight keywords
const highlightKeywords = (text: string): React.ReactNode[] => {
  // Regex to split by keywords but keep them in the array
  const parts = text.split(/(Berkesadaran|Bermakna|Menggembirakan)/gi);
  
  return parts.map((part, index) => {
    const lower = part.toLowerCase();
    if (lower === 'berkesadaran') {
      return <span key={index} className="inline-block px-2 py-0.5 mx-1 rounded-md bg-blue-100 text-blue-700 font-bold text-sm border border-blue-200 shadow-sm">Berkesadaran</span>;
    }
    if (lower === 'bermakna') {
      return <span key={index} className="inline-block px-2 py-0.5 mx-1 rounded-md bg-green-100 text-green-700 font-bold text-sm border border-green-200 shadow-sm">Bermakna</span>;
    }
    if (lower === 'menggembirakan') {
      return <span key={index} className="inline-block px-2 py-0.5 mx-1 rounded-md bg-purple-100 text-purple-700 font-bold text-sm border border-purple-200 shadow-sm">Menggembirakan</span>;
    }
    // Handle bold markdown inside normal text
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
        <span key={index}>
            {boldParts.map((bp, i) => 
                bp.startsWith('**') && bp.endsWith('**') 
                ? <strong key={i} className="font-bold text-slate-900">{bp.replace(/\*\*/g, '')}</strong>
                : bp
            )}
        </span>
    );
  });
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const renderTable = (rows: string[][], key: string) => {
      if (rows.length < 2) return null;
      
      const header = rows[0];
      const body = rows.slice(2);

      return (
          <div key={key} className="overflow-x-auto my-6 border rounded-lg shadow-sm break-inside-avoid">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                      <tr>
                          {header.map((h, i) => (
                              <th key={i} className="px-4 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r last:border-r-0 border-blue-100">
                                  {h.replace(/\*\*/g, '').trim()}
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {body.map((row, rI) => (
                          <tr key={rI} className={rI % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              {row.map((cell, cI) => (
                                  <td key={cI} className="px-4 py-3 text-sm text-gray-700 border-r last:border-r-0 border-slate-100">
                                      {highlightKeywords(cell.trim())}
                                  </td>
                              ))}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      );
  };

  lines.forEach((line, index) => {
    const key = `line-${index}`;
    const trimmed = line.trim();

    // Table handling
    if (trimmed.startsWith('|')) {
        if (!inTable) {
            inTable = true;
            tableRows = [];
        }
        const row = trimmed.split('|').filter(c => c.length > 0); 
        tableRows.push(row);
        
        if (index === lines.length - 1 || !lines[index + 1].trim().startsWith('|')) {
            elements.push(renderTable(tableRows, `table-${index}`));
            inTable = false;
        }
        return;
    }

    // Headers
    if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={key} className="text-3xl font-bold text-blue-900 mt-10 mb-4 border-b-2 border-blue-200 pb-2 print:mt-4">{trimmed.substring(2)}</h1>);
    } else if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={key} className="text-2xl font-bold text-blue-800 mt-8 mb-3 flex items-center print:mt-6"><span className="w-2 h-8 bg-blue-600 mr-3 rounded-sm print:h-6"></span>{trimmed.substring(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={key} className="text-xl font-semibold text-blue-700 mt-6 mb-2 ml-1 print:mt-4">{trimmed.substring(4)}</h3>);
    } else if (trimmed.startsWith('#### ')) {
        elements.push(<h4 key={key} className="text-lg font-semibold text-slate-800 mt-4 mb-2 ml-1">{trimmed.substring(5)}</h4>);
    }
    // Lists
    else if (trimmed.startsWith('- ')) {
        const contentText = trimmed.substring(2);
        elements.push(
            <li key={key} className="ml-6 list-disc mb-2 text-slate-700 pl-1 leading-relaxed">
                {highlightKeywords(contentText)}
            </li>
        );
    }
    else if (trimmed.match(/^\d+\./)) {
         const contentText = trimmed.replace(/^\d+\.\s*/, '');
         const number = trimmed.match(/^\d+/)?.[0];
         elements.push(
            <div key={key} className="flex gap-2 mb-2 ml-2">
                <span className="font-bold text-slate-600">{number}.</span>
                <p className="text-slate-700 leading-relaxed">{highlightKeywords(contentText)}</p>
            </div>
         );
    }
    // Normal paragraphs
    else if (trimmed.length > 0) {
        elements.push(
            <p key={key} className="mb-3 text-slate-700 leading-relaxed">
                {highlightKeywords(trimmed)}
            </p>
        );
    } else {
        elements.push(<div key={key} className="h-2"></div>);
    }
  });

  return <div className="p-2 text-justify">{elements}</div>;
};

export default MarkdownRenderer;
