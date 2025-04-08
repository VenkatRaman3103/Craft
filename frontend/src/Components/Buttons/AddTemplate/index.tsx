import { Plus, Puzzle } from "lucide-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { lightFont } from "@/Styles/base";

export const AddTemplate = ({
    iconColor = lightFont,
    iconLable = "Add",
    isActive = false,
}: {
    iconColor?: string;
    iconLable?: string;
    isActive?: boolean;
}) => {
    return (
        <ButtonWrapper label={iconLable} isActive={isActive}>
            <Plus size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
