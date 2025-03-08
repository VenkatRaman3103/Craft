import { darkFont } from "@/Styles/base";
import {
    Cuboid,
    Parentheses,
    Brackets,
    CodeXml,
    Table,
    List,
    Link,
    CircleArrowOutDownLeft,
    CircleArrowOutUpRight,
    Upload,
    Heading1,
    SquareStack,
    Ampersand,
    UserRound,
    PenTool,
} from "lucide-react";

const iconSize = 34;
const iconColor = darkFont;

export const BlocksIons = {
    normal: <Cuboid size={iconSize} color={iconColor} />,
    array: <Brackets size={iconSize} color={iconColor} />,
    html: <CodeXml size={iconSize} color={iconColor} />,
    code: <Parentheses size={iconSize} color={iconColor} />,
    table: <Table size={iconSize} color={iconColor} />,
    list: <List size={iconSize} color={iconColor} />,
    link: <Link size={iconSize} color={iconColor} />,
    reference: <CircleArrowOutDownLeft size={iconSize} color={iconColor} />,
    dynamic: <CircleArrowOutUpRight size={iconSize} color={iconColor} />,
    upload: <Upload size={iconSize} color={iconColor} />,
    richtext: <Heading1 size={iconSize} color={iconColor} />,
    nested: <SquareStack size={iconSize} color={iconColor} />,
    conditional: <Ampersand size={iconSize} color={iconColor} />,
    user: <UserRound size={iconSize} color={iconColor} />,
    icon: <PenTool size={iconSize} color={iconColor} />,
};
