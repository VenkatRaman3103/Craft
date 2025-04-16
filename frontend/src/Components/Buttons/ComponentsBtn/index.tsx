import { Puzzle } from "lucide-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { lightFont } from "@/Styles/base";

export const ComponentsBtn = ({
    iconColor = lightFont,
    isActive = false,
    labelColor = lightFont,
}: {
    iconColor?: string;
    isActive?: boolean;
    labelColor?: string;
}) => {
    return (
        <ButtonWrapper
            label="Components"
            isActive={isActive}
            color={labelColor}
        >
            <Puzzle size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
