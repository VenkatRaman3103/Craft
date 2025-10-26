import { ComponentProps } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { TextareaField } from "@/components/Forms/Fields/TextareaField";

type StoryPropsType = ComponentProps<typeof TextareaField>;

const meta: Meta<StoryPropsType> = {
    component: TextareaField,
};

export default meta;

type StoryType = StoryObj<StoryPropsType>;

export const TextareaFieldStory: StoryType = {
    args: {
        label: "Textarea",
        name: "textarea",
        placeholder: "Type something...",
        updateFormData: () => {},
        description: "description",
    },
    render: (args) => <TextareaField {...args} />,
};
