import { TextField } from "@/features/Fields/components/TextField";

const TestComp = () => {
    return <div>Hello world</div>;
};

const itemsMap = {
    text: TextField,
};

export function renderItems(props) {
    console.log(props, "props");
    const Component = itemsMap[props.field_type];
    return <Component {...props} />;
}
