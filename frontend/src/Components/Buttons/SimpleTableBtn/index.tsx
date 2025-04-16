import { Table2 } from "lucide-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { lightFont } from "@/Styles/base";

export const SimpleTableBtn = ({
    iconColor = lightFont,
    isActive = false,
    labelColor = lightFont,
}: {
    iconColor?: string;
    isActive?: boolean;
    labelColor?: string;
}) => {
    return (
        <ButtonWrapper label="Table" isActive={isActive} color={labelColor}>
            <Table2 color={iconColor} size={18} />
        </ButtonWrapper>
    );
};
