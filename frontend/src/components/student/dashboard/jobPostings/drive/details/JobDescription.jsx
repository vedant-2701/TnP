export default function JobDescription({ description }) {
    return (
        <div>
            <div className="px-4 py-6 overflow-x-hidden overflow-y-auto">
                <h1 className="text-lg text-wrap break-words leading-relaxed"
                    style={{
                        wordBreak: "break-all", // Force break long strings
                        whiteSpace: "normal", // Ensure text wraps naturally
                        overflowWrap: "break-word", // Fallback for older browsers
                    }}
                >{description}</h1>
            </div>
        </div>
    );
};
