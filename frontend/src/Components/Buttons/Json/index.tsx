import { lightFont } from "@/Styles/base";
import { FileJson2 } from "lucide-react";
import "./index.scss";
import { ButtonWrapper } from "../ButtonWrapper";

export const Json = ({ iconColor = lightFont }: { iconColor?: string }) => {
    return (
        <ButtonWrapper label="API">
            <FileJson2 size={18} color={iconColor} />
        </ButtonWrapper>
    );
};
