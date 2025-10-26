import { ComponentProps } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { TextField } from "@/components/Forms/Fields/TextField";

type StoryPropsType = ComponentProps<typeof TextField>;

const meta: Meta<StoryPropsType> = {
    component: TextField,
};

export default meta;

type StoryType = StoryObj<StoryPropsType>;

export const TextFieldStory: StoryType = {
    args: {
        label: "Label",
        name: "name",
        placeholder: "Placeholder",
        updateFormData: () => {},
        description: "Description",
    },
    render: (args) => <TextField {...args} />,
};
