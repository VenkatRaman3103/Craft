import { lightFont } from "@/Styles/base";
import { ArrowDownToLine } from "lucide-react";
import "./index.scss";
import { ButtonWrapper } from "../ButtonWrapper";

export const Save = ({ iconColor = lightFont }: { iconColor?: string }) => {
    return (
        <ButtonWrapper label="Save">
            <ArrowDownToLine size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
