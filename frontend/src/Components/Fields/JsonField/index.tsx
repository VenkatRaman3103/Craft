import React, { useRef, useEffect, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import "./index.scss";
import { FieldWrapper } from "../FieldWrapper";
import { field } from "@/Types/fields";

const ayuDarkColors = {
    background: "#101011",
    foreground: "#B3B1AD",
    selection: "#253340",
    cursor: "#E6B450",
    gutterBackground: "#101011",
    gutterForeground: "#3D424D",

    string: "#C2D94C",
    number: "#FFEE99",
    keyword: "#FF8F40",
    comment: "#626A73",
    property: "#39BAE6",
    operator: "#F29E74",
    variable: "#B3B1AD",
    function: "#FFB454",
    className: "#59C2FF",
    typeParameter: "#FF8F40",
    tag: "#39BAE6",
    attributeName: "#FFB454",
    attributeValue: "#C2D94C",
};

const ayuDark = EditorView.theme({
    "&": {
        backgroundColor: ayuDarkColors.background,
        color: ayuDarkColors.foreground,
    },
    ".cm-content": {
        caretColor: ayuDarkColors.cursor,
    },
    ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: ayuDarkColors.cursor,
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        {
            backgroundColor: ayuDarkColors.selection,
        },
    ".cm-gutters": {
        backgroundColor: ayuDarkColors.gutterBackground,
        color: ayuDarkColors.gutterForeground,
        borderRight: "0px solid rgba(61, 66, 77, 0.5)",
    },
    ".cm-activeLine": {
        backgroundColor: "#1c1d1f",
    },
    ".cm-activeLineGutter": {
        backgroundColor: "#1c1d1f",
    },
});

const ayuDarkHighlightStyle = HighlightStyle.define([
    { tag: tags.string, color: ayuDarkColors.string },
    { tag: tags.number, color: ayuDarkColors.number },
    { tag: tags.keyword, color: ayuDarkColors.keyword },
    { tag: tags.comment, color: ayuDarkColors.comment },
    { tag: tags.propertyName, color: ayuDarkColors.property },
    { tag: tags.operator, color: ayuDarkColors.operator },
    { tag: tags.variableName, color: ayuDarkColors.variable },
    { tag: tags.function(tags.variableName), color: ayuDarkColors.function },
    { tag: tags.className, color: ayuDarkColors.className },
    { tag: tags.typeName, color: ayuDarkColors.typeParameter },
    { tag: tags.tagName, color: ayuDarkColors.tag },
    { tag: tags.attributeName, color: ayuDarkColors.attributeName },
    { tag: tags.attributeValue, color: ayuDarkColors.attributeValue },
]);

const ayuDarkTheme = [ayuDark, syntaxHighlighting(ayuDarkHighlightStyle)];

export const JSONField = ({ data }: { data: field }) => {
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const [isEditorReady, setIsEditorReady] = useState(false);

    const [jsonValue, setJsonValue] = useState(
        typeof data.value === "string"
            ? data.value
            : JSON.stringify(data.value, null, 2),
    );

    const getExtensions = () => [
        basicSetup,
        json(),
        ayuDarkTheme,
        keymap.of([indentWithTab, ...defaultKeymap]),
        EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                const newValue = update.state.doc.toString();
                setJsonValue(newValue);
            }
        }),
    ];

    useEffect(() => {
        if (containerRef.current && !viewRef.current) {
            const startState = EditorState.create({
                doc: jsonValue,
                extensions: getExtensions(),
            });

            const view = new EditorView({
                state: startState,
                parent: containerRef.current,
            });

            viewRef.current = view;
            setIsEditorReady(true);

            return () => {
                if (viewRef.current) {
                    viewRef.current.destroy();
                    viewRef.current = null;
                }
            };
        }
    }, []);

    useEffect(() => {
        const newValue =
            typeof data.value === "string"
                ? data.value
                : JSON.stringify(data.value, null, 2);

        if (isEditorReady && viewRef.current && newValue !== jsonValue) {
            setJsonValue(newValue);

            const newState = EditorState.create({
                doc: newValue,
                extensions: getExtensions(),
            });

            viewRef.current.setState(newState);
        }
    }, [data, isEditorReady]);

    return (
        <div className="json-input-field-container">
            <div
                ref={containerRef}
                className="codemirror-editor-container"
                style={{ width: "100%", height: "300px" }}
            />
        </div>
    );
};
