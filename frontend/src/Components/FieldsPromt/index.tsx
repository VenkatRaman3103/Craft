import { TextFieldPromt } from "./TextFieldPromt";
import "./index.scss";
import { FieldPromtWrapper } from "./FiedsPromtWrapper";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createField } from "@/Pages/Page/api";

export const FieldsPromt = ({
    field,
    queryClient,
    page_id,
    handleFieldsCancel,
}: any) => {
    const [fieldName, setFieldName] = useState("");

    const [text, setText] = useState<string>("");

    // TODO: move to render fields list
    function renderFieldsPromt(fieldType: string): React.JSX.Element {
        switch (fieldType) {
            case "text":
                return <TextFieldPromt text={text} setText={setText} />;
            default:
                return <p>Yet to be done</p>;
        }
    }

    const fieldMutation = useMutation(
        () =>
            createField(
                {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "text",
                    value: text,
                },
                page_id,
            ),
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
                    >
                        Create Block
                    </button>
                </div>
            </div>
        </FieldPromtWrapper>
    );
};
