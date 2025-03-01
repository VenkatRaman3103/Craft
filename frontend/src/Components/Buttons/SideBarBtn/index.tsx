import { PanelRightOpen } from "lucide-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { lightFont } from "@/Styles/base";

export const SideBarBtn = ({
    iconColor = lightFont,
    isActive = false,
    labelColor = lightFont,
}: {
    iconColor?: string;
    isActive?: boolean;
    labelColor?: string;
}) => {
    return (
        <ButtonWrapper label="More" isActive={isActive} color={labelColor}>
            <PanelRightOpen size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
