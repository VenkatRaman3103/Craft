import { lightFont } from "@/Styles/base";
import { ArrowDownToLine } from "lucide-react";
import "./index.scss";
import { ButtonWrapper } from "../ButtonWrapper";

export const Save = ({
    iconColor = lightFont,
    isActive = false,
    labelColor = lightFont,
}: {
    iconColor?: string;
    isActive?: boolean;
    labelColor?: string;
}) => {
    return (
        <ButtonWrapper label="Save" isActive={isActive} color={labelColor}>
            <ArrowDownToLine size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
