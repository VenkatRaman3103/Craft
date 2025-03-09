import { lightFont } from "@/Styles/base";
import {
    AtSign,
    Braces,
    CalendarDays,
    CircleCheck,
    Divide,
    Image,
    LetterText,
    Link,
    Paintbrush,
    SquareCheck,
    Type,
} from "lucide-react";

export const FieldsIcons = {
    color_picker_field: <Paintbrush size={20} color={lightFont} />,
    text_field: <Type size={20} color={lightFont} />,
    number_field: <Divide size={20} color={lightFont} />,
    json: <Braces size={20} color={lightFont} />,
    multi_select_field: <SquareCheck size={20} color={lightFont} />,
    "rich-text": <LetterText size={20} color={lightFont} />,
    single_select_field: <CircleCheck size={20} color={lightFont} />,
    date_field: <CalendarDays size={20} color={lightFont} />,
    email_field: <AtSign size={20} color={lightFont} />,
    upload: <Image size={20} color={lightFont} />,
    relation: <Link size={20} color={lightFont} />,
};
