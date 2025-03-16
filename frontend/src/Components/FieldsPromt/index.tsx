import { TextFieldPromt } from "./TextFieldPromt";
import "./index.scss";
import { FieldPromtWrapper } from "./FiedsPromtWrapper";
import { useEffect, useState } from "react";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createField } from "@/Pages/Page/api";
import { MultiSelectPrompt } from "./MultiSelectPromt";
import { SingleSelectPromt } from "./SingleSelectPromt";
import React from "react";
import { colorPicker, fieldPromt } from "@/Types/fields";
import { NumberPrompt } from "./NumberPrompt";
import { EmailPrompt } from "./EmailPrompt";
import { DatePrompt } from "./DatePrompt";
import { ColorPickerPrompt } from "./ColorPickerPrompt";
import { TextareaFieldPrompt } from "./TextareaPrompt";
import { JSONPromptField } from "./JsonPromptField";
import { UrlPromt } from "./UrlPromptField";
import { v4 as uuidv4 } from "uuid";

type optType = { id: string; value: string | undefined };

export const FieldsPromt = ({
    field,
    queryClient,
    query_key_id,
    fieldType,
    queryKey,
    itemType,
    handleFieldsCancel,
}: {
    field: any;
    queryClient: QueryClient;
    query_key_id: string | undefined;
    fieldType: string;
    queryKey: [string, string | undefined];
    page_id?: string | undefined;
    handleFieldsCancel: (promtField: fieldPromt) => void;
    itemType: string;
}) => {
    const [fieldName, setFieldName] = useState("");

    useEffect(() => {
        if (fieldType === "local") {
            setFieldName(field.name);
        }
    }, [field, fieldType]);

    // text
    const [text, setText] = useState<string>(field.value ? field.value : "");

    // multi select field
    const [multiSelectOptions, setMultiSelectOptions] = useState(
        field.options ? field.options : [],
    );
    const [checkedMultiSelectItems, setCheckedMultiSelectItems] = useState<{
        [key: string]: boolean;
    }>(field.value ? field.value : {});

    // single select field
    const [singleSelectOptions, setSingleSelectOptions] = useState(
        field.options ? field.options : [],
    );
    const [checkedsingleSelectItems, setCheckedSingleSelectItems] = useState<{
        [key: string]: boolean;
    }>(field.value ? field.value : {});

    // number
    const [number, setNumber] = useState<number>(field.value ? field.value : 0);

    // email
    const [email, setEmail] = useState<string>(field.value ? field.value : "");

    // date
    const [date, setDate] = useState<Date | null>(
        field.value ? new Date(field.value) : null,
    );

    // color picker
    const [color, setColor] = useState<colorPicker>(
        field.value
            ? field.value
            : {
                  value: "#3498db",
                  hex: "#3498db",
                  rgb: { r: 52, g: 152, b: 219 },
                  rgba: { r: 52, g: 152, b: 219, a: 1 },
                  hsl: { h: 204, s: 70, l: 53 },
                  hsla: { h: 204, s: 70, l: 53, a: 1 },
              },
    );

    // textarea
    const [textarea, setTextarea] = useState(field.value ? field.value : "");

    //json
    const [jsonData, setJsonData] = useState(
        field.value ? field.value : '{"example": "data"}',
    );

    // url
    const [url, setUrl] = useState(
        field.value
            ? { value: field.value, url_type: field.url_type }
            : {
                  value: "",
                  url_type: "https",
              },
    );

    // TODO: move to render fields list
    function renderFieldsPromt(fieldType: string): React.JSX.Element {
        console.log(fieldType, "fieldType");
        switch (fieldType) {
            case "text_field":
                return <TextFieldPromt text={text} setText={setText} />;
            case "multi_select_field":
            case "multi_select":
                return (
                    <MultiSelectPrompt
                        options={multiSelectOptions}
                        setOptions={setMultiSelectOptions}
                        checkedItems={checkedMultiSelectItems}
                        setCheckedItems={setCheckedMultiSelectItems}
                    />
                );
            case "single_select_field":
            case "single_select":
                return (
                    <SingleSelectPromt
                        options={singleSelectOptions}
                        setOptions={setSingleSelectOptions}
                        checkedItems={checkedsingleSelectItems}
                        setCheckedItems={setCheckedSingleSelectItems}
                    />
                );
            case "number_field":
                return <NumberPrompt number={number} setNumber={setNumber} />;

            case "email_field":
                return <EmailPrompt email={email} setEmail={setEmail} />;

            case "date_field":
                return <DatePrompt date={date} setDate={setDate} />;
            case "color_picker_field":
                return <ColorPickerPrompt color={color} setColor={setColor} />;
            case "textarea_field":
                return (
                    <TextareaFieldPrompt
                        textarea={textarea}
                        setTextarea={setTextarea}
                    />
                );
            case "json_field":
                return (
                    <JSONPromptField json={jsonData} setJSON={setJsonData} />
                );
            case "url_field":
                return <UrlPromt url={url} setUrl={setUrl} />;
            default:
                return <p>Yet to be done</p>;
        }
    }

    const fieldMutation = useMutation(
        () => {
            let payload;
            let parent_id = query_key_id;

            if (
                field.type === "multi_select_field" ||
                field.type === "multi_select"
            ) {
                const selectedOptions = multiSelectOptions
                    .filter((opt: optType) => checkedMultiSelectItems[opt.id])
                    .map((opt: optType) => opt.value);

                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "multi_select_field",
                    options: multiSelectOptions.map(
                        (opt: optType) => opt.value,
                    ),
                    selectedOptions,
                };
            } else if (
                field.type === "single_select_field" ||
                field.type === "single_select"
            ) {
                const selectedOptions = singleSelectOptions
                    .filter((opt: optType) => checkedsingleSelectItems[opt.id])
                    .map((opt: optType) => opt.value);

                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "single_select_field",
                    options: singleSelectOptions.map(
                        (opt: optType) => opt.value,
                    ),
                    selectedOptions,
                };
            } else if (field.type === "text_field") {
                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "text_field",
                    value: text,
                };
            } else if (field.type === "number_field") {
                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "number_field",
                    value: number,
                };
            } else if (field.type === "email_field") {
                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "email_field",
                    value: email,
                };
            } else if (field.type === "date_field") {
                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "date_field",
                    value: date ? date.toISOString() : null,
                };
            } else if (field.type === "color_picker_field") {
                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "color_picker_field",
                    value: color.value,
                    hex: color.hex,
                    rgb: color.rgb,
                    rgba: color.rgba,
                    hsl: color.hsl,
                    hsla: color.hsla,
                };
            } else if (field.type === "textarea_field") {
                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "textarea_field",
                    value: textarea,
                };
            } else if (field.type === "json_field") {
                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "json_field",
                    value: jsonData,
                };
            } else if (field.type == "url_field") {
                payload = {
                    name: fieldName.split(" ").join("-").toLowerCase(),
                    label: fieldName,
                    type: "url_field",
                    value: url.value,
                    url_type: url.type,
                };
            }

            return createField(payload, parent_id, itemType);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: queryKey,
                });
                handleFieldsCancel(field);
            },
        },
    );

    async function handleCreteField() {
        fieldMutation.mutate();
    }

    console.log(field, "colorField");

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
