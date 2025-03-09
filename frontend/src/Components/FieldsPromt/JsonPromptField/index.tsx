import React, { useRef, useEffect, useState } from "react";
import * as monaco from "monaco-editor";
import "./index.scss";

export const JSONPromptField = ({ json, setJSON }) => {
    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [internalValue, setInternalValue] = useState(
        typeof json === "string" ? json : JSON.stringify(json, null, 2),
    );

    // Use local state to track user edits without immediately syncing with parent
    const isUserEditingRef = useRef(false);

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
                value: internalValue,
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
    }, [internalValue]);

    // Handle content changes with debounce
    useEffect(() => {
        if (!isEditorReady || !editorRef.current) return;

        let timeoutId;
        const changeHandler = () => {
            if (!editorRef.current) return;

            // Mark that user is editing (prevents external updates during user typing)
            isUserEditingRef.current = true;

            // Update internal state immediately to prevent cursor jump
            const currentValue = editorRef.current.getValue();
            setInternalValue(currentValue);

            // Debounce the parent update
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                try {
                    // Try to parse JSON to validate it
                    JSON.parse(currentValue);
                    // Only update parent if valid JSON
                    setJSON(currentValue);
                } catch (e) {
                    // Don't update parent if invalid JSON
                    console.warn("Invalid JSON", e);
                }

                // Reset editing flag after debounce
                setTimeout(() => {
                    isUserEditingRef.current = false;
                }, 100);
            }, 500); // 500ms debounce
        };

        const disposable =
            editorRef.current.onDidChangeModelContent(changeHandler);

        return () => {
            clearTimeout(timeoutId);
            disposable.dispose();
        };
    }, [isEditorReady, setJSON]);

    // Only update from props when user is not actively editing
    useEffect(() => {
        if (isEditorReady && editorRef.current && !isUserEditingRef.current) {
            const newValue =
                typeof json === "string" ? json : JSON.stringify(json, null, 2);

            if (internalValue !== newValue) {
                // Store cursor/selection state
                const selections = editorRef.current.getSelections();
                const scrollPosition = editorRef.current.getScrollPosition();

                // Update value
                editorRef.current.setValue(newValue);
                setInternalValue(newValue);

                // Restore cursor/selection
                if (selections && selections.length) {
                    editorRef.current.setSelections(selections);
                    editorRef.current.setScrollPosition(scrollPosition);
                }
            }
        }
    }, [isEditorReady, json, internalValue]);

    return (
        <div className="json-input-field-container">
            <div
                ref={containerRef}
                className="monaco-editor-container"
                style={{ width: "100%", height: "300px" }}
            />
        </div>
    );
};
