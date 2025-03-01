import { PanelRightOpen } from "lucide-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { lightFont } from "@/Styles/base";

export const SideBarBtn = ({
    iconColor = lightFont,
    isActive = false,
}: {
    iconColor?: string;
    isActive?: boolean;
}) => {
    return (
        <ButtonWrapper label="More" isActive={isActive}>
            <PanelRightOpen size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
