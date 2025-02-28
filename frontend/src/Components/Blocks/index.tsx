import { useState } from "react";
import { Fields } from "../Fields/RenderFields";
import { blockType } from "@/Types/blocks";
import "./index.scss";

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
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="block-container">
            <div className="block-wrapper">
                <div
                    className={`block-header-container ${isCollapsed ? "collapsed" : ""}`}
                    onClick={toggleCollapse}
                >
                    <div className="block-header-wrapper">
                        <div className="block-type">{block.type}</div>
                    </div>
                </div>
                <div
                    className={`fields-container ${isCollapsed ? "collapsed" : ""}`}
                >
                    <Fields fields={block.fields} />
                </div>
            </div>
        </div>
    );
};
