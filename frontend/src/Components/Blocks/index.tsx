import { Fields } from "../Fields/RenderFields";
import { blockType } from "@/Types/blocks";
import "./index.scss";
import { GripVertical } from "lucide-react";
import { darkFont, lightFont } from "@/Styles/base";

export const Blocks = ({ blocks }: { blocks: blockType[] }) => {
    return (
        <div className="blocks-container">
            {blocks.map((item, index) => (
                <Block key={index} block={item} />
            ))}
        </div>
    );
};

export const Block = ({ block }: { block: blockType }) => {
    return (
        <div className="block-container">
            <GripVertical size={16} color={lightFont} className="drag-handle" />
            <div className="block-wrapper">
                <div className="block-header">
                    <div className="block-type">{block.type}</div>
                </div>
                <div className="fields-container">
                    <Fields fields={block.fields} />
                </div>
            </div>
        </div>
    );
};
