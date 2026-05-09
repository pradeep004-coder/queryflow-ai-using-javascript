import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism } from 'react-syntax-highlighter';
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


export function AnswerLine({ ans, ansType, language }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(ans);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
    };

    if (!ans) return null;


    switch (ansType) {
        case 'code':
            return (
                <div className="max-w-full my-4">
                    <div className="bg-zinc-600 px-4 py-2 flex justify-between rounded-t-lg">
                        <div className="text-md">{language}</div>
                        <button
                            type="button"
                            className="text-sm px-1 rounded-md bg-zinc-700 hover:bg-zinc-500 transition-colors border border-zinc-500"
                            onClick={handleCopy}>{isCopied ? 'copied' : 'copy'}</button>
                    </div>
                    <div className="rounded-b-lg">
                        <pre className="whitespace-normal">
                            <Prism language={language.toLowerCase()} style={oneDark}>
                                {ans}
                            </Prism>
                        </pre>
                    </div>
                </div>
            );

        case 't':
            return (
                <div className="max-w-full text-sm text-zinc-200 font-bold mt-4 mb-2 whitespace-normal">
                    <ReactMarkdown>{ans.replace("##", "")}</ReactMarkdown>
                </div>
            );

        case 'h1':
            return (
                <div className="max-w-full text-sm text-zinc-200 mt-4 mb-2 whitespace-normal">
                    <ReactMarkdown>{ans}</ReactMarkdown>
                </div>
            );

        case 'h2':
            return (
                <div className="max-w-full text-sm text-zinc-300 mt-3 mb-1 whitespace-normal">
                    <ReactMarkdown>{ans}</ReactMarkdown>
                </div>
            );

        case 'h3':
            return (
                <div className="max-w-full font-medium text-sm text-zinc-400 mt-2 ml-2 whitespace-normal">
                    <ReactMarkdown>{ans}</ReactMarkdown>
                </div>
            );

        default:
            return (
                <div className="text-sm text-zinc-300 my-1">
                    <ReactMarkdown>{ans}</ReactMarkdown>
                </div>
            );

    }
}