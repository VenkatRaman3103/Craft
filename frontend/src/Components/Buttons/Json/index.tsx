import { lightFont } from "@/Styles/base";
import { FileJson2 } from "lucide-react";
import "./index.scss";
import { ButtonWrapper } from "../ButtonWrapper";

export const Json = ({
    iconColor = lightFont,
    isActive = false,
    labelColor = lightFont,
}: {
    iconColor?: string;
    isActive?: boolean;
    labelColor?: string;
}) => {
    return (
        <ButtonWrapper label="API" isActive={isActive} color={labelColor}>
            <FileJson2 size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
