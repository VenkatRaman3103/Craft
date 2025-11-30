import { TextField } from "@/features/Fields/components/TextField";

const itemsMap = {
    text: TextField,
};

export function renderItems(props) {
    console.log(props, "props");
    const Component = itemsMap[props.field_type];
    return <Component {...props} />;
}
