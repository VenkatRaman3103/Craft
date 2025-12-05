import { TextField } from "@/features/Fields/components/TextField";

export function renderItems({ type, ...rest }) {
    const itemsMap = {
        text: TextField,
        // add others...
    };

    console.log(type, rest, "rest");

    const Component = itemsMap[type];

    if (!Component) {
        console.warn("Component for type", type, "not found!");
        return <TextField {...rest} />; // prevents crash
    }

    return <Component {...rest} />;
}
