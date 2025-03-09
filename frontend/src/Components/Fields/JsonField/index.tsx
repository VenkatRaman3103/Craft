import React, { useRef, useEffect, useState } from "react";
import * as monaco from "monaco-editor";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";
import { field } from "@/Types/fields";

export const JSONField = ({ data }: { data: field }) => {
    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [jsonValue, setJsonValue] = useState(
        typeof data.value === "string"
            ? data.value
            : JSON.stringify(data.value, null, 2),
    );

    // Monaco theme definition
    monaco.editor.defineTheme("myCustomTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#101011",
        },
    });

    // Setup editor only once on mount
    useEffect(() => {
        if (containerRef.current && !editorRef.current) {
            // Initialize Monaco editor
            const editor = monaco.editor.create(containerRef.current, {
                value: jsonValue,
                language: "json",
                theme: "myCustomTheme",
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 16,
                lineNumbers: "on",
                tabSize: 4,
                wordWrap: "on",
                scrollbar: {
                    useShadows: false,
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                    alwaysConsumeMouseWheel: false,
                },
                formatOnPaste: true,
            });

            // Save editor reference
            editorRef.current = editor;
            setIsEditorReady(true);

            // Clean up on unmount
            return () => {
                editor.dispose();
                editorRef.current = null;
            };
        }
    }, []);

    // Handle content changes
    useEffect(() => {
        if (!isEditorReady || !editorRef.current) return;

        const changeHandler = () => {
            if (!editorRef.current) return;
            const currentValue = editorRef.current.getValue();
            setJsonValue(currentValue);
        };

        const disposable =
            editorRef.current.onDidChangeModelContent(changeHandler);

        return () => {
            disposable.dispose();
        };
    }, [isEditorReady]);

    return (
        <FieldWrapper data={data}>
            <div className="json-input-field-container">
                <div
                    ref={containerRef}
                    className="monaco-editor-container"
                    style={{ width: "100%", height: "300px" }}
                />
            </div>
        </FieldWrapper>
    );
};
