import React, { useRef, useEffect, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import "./index.scss";

export const JSONPromptField = ({ json: jsonProp, setJSON }) => {
    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const viewRef = useRef(null);
    const isEditingRef = useRef(false);
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Store the initial and current value
    const [internalValue, setInternalValue] = useState(
        typeof jsonProp === "string"
            ? jsonProp
            : JSON.stringify(jsonProp, null, 2),
    );

    // Keep track of the last value we sent to parent
    const lastSyncedValueRef = useRef(internalValue);

    // Initialize the editor
    useEffect(() => {
        if (containerRef.current && !viewRef.current) {
            const startState = EditorState.create({
                doc: internalValue,
                extensions: [
                    basicSetup,
                    json(),
                    oneDark,
                    keymap.of([indentWithTab, ...defaultKeymap]),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            isEditingRef.current = true;
                            const newValue = update.state.doc.toString();
                            setInternalValue(newValue);

                            // Debounce the parent update
                            clearTimeout(editorRef.current);
                            editorRef.current = setTimeout(() => {
                                try {
                                    // Try to parse JSON to validate
                                    JSON.parse(newValue);

                                    // Only update parent if valid JSON and value has changed
                                    if (
                                        newValue !== lastSyncedValueRef.current
                                    ) {
                                        setJSON(newValue);
                                        lastSyncedValueRef.current = newValue;
                                    }
                                } catch (e) {
                                    console.warn("Invalid JSON", e);
                                }

                                // After debounce completes, allow external updates again
                                setTimeout(() => {
                                    isEditingRef.current = false;
                                }, 200);
                            }, 800);
                        }
                    }),
                    EditorView.domEventHandlers({
                        focus: () => {
                            isEditingRef.current = true;
                        },
                        blur: () => {
                            // Small delay before allowing external updates to ensure
                            // the blur event doesn't immediately reset editing state
                            setTimeout(() => {
                                isEditingRef.current = false;
                            }, 200);
                        },
                    }),
                ],
            });

            // Create the editor view
            const view = new EditorView({
                state: startState,
                parent: containerRef.current,
            });

            viewRef.current = view;
            setIsEditorReady(true);

            // Clean up
            return () => {
                if (viewRef.current) {
                    clearTimeout(editorRef.current);
                    viewRef.current.destroy();
                    viewRef.current = null;
                }
            };
        }
    }, []);

    // Handle changes from parent props
    useEffect(() => {
        const externalValue =
            typeof jsonProp === "string"
                ? jsonProp
                : JSON.stringify(jsonProp, null, 2);

        // Only update when editor is ready, not editing, and value has changed
        if (
            isEditorReady &&
            viewRef.current &&
            externalValue !== internalValue &&
            !isEditingRef.current
        ) {
            // Store cursor position
            const prevSel = viewRef.current.state.selection;

            // Create a new state with the updated content
            const newState = EditorState.create({
                doc: externalValue,
                extensions: viewRef.current.state.extensions,
            });

            // Update editor
            viewRef.current.setState(newState);

            // Update internal state
            setInternalValue(externalValue);
            lastSyncedValueRef.current = externalValue;
        }
    }, [isEditorReady, jsonProp, internalValue]);

    return (
        <div className="json-input-field-container">
            <div
                ref={containerRef}
                className="codemirror-editor-container"
                style={{ width: "100%", height: "300px", overflow: "auto" }}
            />
        </div>
    );
};
