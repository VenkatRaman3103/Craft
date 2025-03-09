import React from "react";
import "./index.scss";

interface TextareaFieldPromptProps {
    textarea: string;
    setTextarea: (value: string) => void;
}

export const TextareaFieldPrompt: React.FC<TextareaFieldPromptProps> = ({
    textarea,
    setTextarea,
}) => {
    function handleTextareaChange(
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) {
        event.preventDefault();
        setTextarea(event.target.value);
    }

    return (
        <div className="textarea-input-field-container">
            <textarea
                className="textarea-input-field"
                value={textarea}
                onChange={handleTextareaChange}
                placeholder="Enter your text here..."
            />
        </div>
    );
};
