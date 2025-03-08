import { TextFieldPromt } from "./TextFieldPromt";
import "./index.scss";
import { FieldPromtWrapper } from "./FiedsPromtWrapper";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createField } from "@/Pages/Page/api";
import { MultiSelectPrompt } from "./MultiSelectPromt";
import { SingleSelectPromt } from "./SingleSelectPromt";

export const FieldsPromt = ({
    field,
    queryClient,
    page_id,
    handleFieldsCancel,
}: any) => {
    const [fieldName, setFieldName] = useState("");
    const [text, setText] = useState<string>("");

    // multi select field
    const [multiSelectOptions, setMultiSelectOptions] = useState<any>([]);
    const [checkedMultiSelectItems, setCheckedMultiSelectItems] = useState<any>(
        {},
    );

    // single select field
    const [singleSelectOptions, setSingleSelectOptions] = useState<any>([]);
    const [checkedsingleSelectItems, setCheckedSingleSelectItems] =
        useState<any>({});

    console.log(
        singleSelectOptions,
        checkedsingleSelectItems,
        "checkedsingleSelectItems",
    );

    // TODO: move to render fields list
    function renderFieldsPromt(fieldType: string): React.JSX.Element {
        switch (fieldType) {
            case "text_field":
                return <TextFieldPromt text={text} setText={setText} />;
            case "multi_select_field":
                return (
                    <MultiSelectPrompt
                        options={multiSelectOptions}
                        setOptions={setMultiSelectOptions}
                        checkedItems={checkedMultiSelectItems}
                        setCheckedItems={setCheckedMultiSelectItems}
                    />
                );
            case "single_select_field":
                return (
                    <SingleSelectPromt
                        options={singleSelectOptions}
                        setOptions={setSingleSelectOptions}
                        checkedItems={checkedsingleSelectItems}
                        setCheckedItems={setCheckedSingleSelectItems}
                    />
                );
            default:
                return <p>Yet to be done</p>;
        }
    }

    const fieldMutation = useMutation(
        () => {
            let payload;

            if (field.type === "multi_select_field") {
                const selectedOptions = multiSelectOptions
                    .filter((opt) => checkedMultiSelectItems[opt.id])
                    .map((opt) => opt.value);

                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "multi_select_field",
                    options: multiSelectOptions.map((opt) => opt.value),
                    selectedOptions,
                };
            } else if (field.type === "single_select_field") {
                const selectedOptions = singleSelectOptions
                    .filter((opt) => checkedsingleSelectItems[opt.id])
                    .map((opt) => opt.value);

                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "single_select_field",
                    options: singleSelectOptions.map((opt) => opt.value),
                    selectedOptions,
                };
            } else {
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
                                multiSelectOptions.length === 0) ||
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
