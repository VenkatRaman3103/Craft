import { Table2 } from "lucide-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { lightFont } from "@/Styles/base";

export const SimpleTableBtn = ({
    iconColor = lightFont,
}: {
    iconColor?: string;
}) => {
    return (
        <ButtonWrapper label="Table">
            <Table2 color={iconColor} size={18} />
        </ButtonWrapper>
    );
};
