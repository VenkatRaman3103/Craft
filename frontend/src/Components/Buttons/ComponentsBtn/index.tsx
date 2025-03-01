import { Puzzle } from "lucide-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { lightFont } from "@/Styles/base";

export const ComponentsBtn = ({
    iconColor = lightFont,
}: {
    iconColor?: string;
}) => {
    return (
        <ButtonWrapper label="Component">
            <Puzzle size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
