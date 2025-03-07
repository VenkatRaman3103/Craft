import { TextFieldPromt } from "./TextFieldPromt";
import "./index.scss";
import { FieldPromtWrapper } from "./FiedsPromtWrapper";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createField } from "@/Pages/Page/api";
import { MultiSelectPrompt } from "./MultiSelectPromt";

export const FieldsPromt = ({
    field,
    queryClient,
    page_id,
    handleFieldsCancel,
}: any) => {
    const [fieldName, setFieldName] = useState("");
    const [text, setText] = useState<string>("");
    const [options, setOptions] = useState<any>([]);
    const [checkedItems, setCheckedItems] = useState<any>({});

    // TODO: move to render fields list
    function renderFieldsPromt(fieldType: string): React.JSX.Element {
        switch (fieldType) {
            case "text_field":
                return <TextFieldPromt text={text} setText={setText} />;
            case "multi_select_field":
                return (
                    <MultiSelectPrompt
                        options={options}
                        setOptions={setOptions}
                        checkedItems={checkedItems}
                        setCheckedItems={setCheckedItems}
                    />
                );
            default:
                return <p>Yet to be done</p>;
        }
    }

    const fieldMutation = useMutation(
        () => {
            // Create different payload based on field type
            let payload;

            if (field.type === "multi_select_field") {
                // For multi_select_field, prepare payload with checked options
                const selectedOptions = options
                    .filter((opt) => checkedItems[opt.id])
                    .map((opt) => opt.value);

                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "multi_select_field",
                    options: options.map((opt) => opt.value),
                    "hello world": selectedOptions,
                };
            } else {
                // For other field types (like text_field)
                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "text_field",
                    value: text,
                };
            }

            return createField(payload, page_id);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["pageData", page_id],
                });
                handleFieldsCancel(field);
            },
        },
    );

    async function handleCreteField() {
        fieldMutation.mutate();
    }

    return (
        <FieldPromtWrapper
            data={field}
            fieldName={fieldName}
            setFieldName={setFieldName}
        >
            <div className="fields-promt-wrapper">
                {renderFieldsPromt(field.type)}
                <div className="action-btn-wrapper">
                    <button
                        className="create-block-button"
                        onClick={() => handleFieldsCancel(field)}
                    >
                        Cancel
                    </button>
                    <button
                        className="create-block-button"
                        onClick={handleCreteField}
                        disabled={
                            !fieldName ||
                            (field.type === "multi_select_field" &&
                                options.length === 0) ||
                            (field.type === "text_field" && !text)
                        }
                    >
                        Create Block
                    </button>
                </div>
            </div>
        </FieldPromtWrapper>
    );
};
