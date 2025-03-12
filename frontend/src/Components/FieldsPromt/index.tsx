import { TextFieldPromt } from "./TextFieldPromt";
import "./index.scss";
import { FieldPromtWrapper } from "./FiedsPromtWrapper";
import { useState } from "react";
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
import { type } from "os";

type optType = { id: string; value: string | undefined };

export const FieldsPromt = ({
    field,
    queryClient,
    page_id,
    handleFieldsCancel,
}: {
    field: fieldPromt;
    queryClient: QueryClient;
    page_id: string | undefined;
    handleFieldsCancel: (promtField: fieldPromt) => void;
}) => {
    const [fieldName, setFieldName] = useState("");

    // text
    const [text, setText] = useState<string>("");

    // multi select field
    const [multiSelectOptions, setMultiSelectOptions] = useState([]);
    const [checkedMultiSelectItems, setCheckedMultiSelectItems] = useState<{
        [key: string]: boolean;
    }>({});

    // single select field
    const [singleSelectOptions, setSingleSelectOptions] = useState([]);
    const [checkedsingleSelectItems, setCheckedSingleSelectItems] = useState<{
        [key: string]: boolean;
    }>({});

    // number
    const [number, setNumber] = useState<number>(0);

    // email
    const [email, setEmail] = useState<string>("");

    // date
    const [date, setDate] = useState<Date | null>(null);

    // color picker
    const [color, setColor] = useState<colorPicker>({
        value: "#3498db",
        hex: "#3498db",
        rgb: { r: 52, g: 152, b: 219 },
        rgba: { r: 52, g: 152, b: 219, a: 1 },
        hsl: { h: 204, s: 70, l: 53 },
        hsla: { h: 204, s: 70, l: 53, a: 1 },
    });

    // textarea
    const [textarea, setTextarea] = useState("");

    //json
    const [jsonData, setJsonData] = useState('{"example": "data"}');

    // url
    const [url, setUrl] = useState({
        value: "",
        url_type: "https",
    });

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

            if (field.type === "multi_select_field") {
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
            } else if (field.type === "single_select_field") {
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
                    >
                        Create Block
                    </button>
                </div>
            </div>
        </FieldPromtWrapper>
    );
};
