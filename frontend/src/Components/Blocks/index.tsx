import { Fields } from "../Fields/RenderFields";
import { blockType } from "@/Types/blocks";

export const Blocks = ({ blocks }: { blocks: blockType[] }) => {
    return (
        <div>
            {blocks.map((item, index) => (
                <Block key={index} block={item} />
            ))}
        </div>
    );
};

export const Block = ({ block }: { block: blockType }) => {
    return (
        <div>
            <h3>{block.type}</h3>
            <Fields fields={block.fields} />
        </div>
    );
};
