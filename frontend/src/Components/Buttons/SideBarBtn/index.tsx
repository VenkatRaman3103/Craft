import { PanelRightOpen } from "lucide-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { lightFont } from "@/Styles/base";

export const SideBarBtn = ({
    iconColor = lightFont,
}: {
    iconColor?: string;
}) => {
    return (
        <ButtonWrapper label="More">
            <PanelRightOpen size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
