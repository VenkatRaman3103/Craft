import { useState } from "react";
import { ElementsTab } from "./ElementsTab";
import { ElementsContent } from "./ElementsContent";
import "./index.scss";

type Props = {
    elements: any;
};

export const Elements = ({ elements }: Props) => {
    const [activeElement, setActiveElement] = useState(0);

    return (
        <div className="elements-tabs-container">
            <ElementsTab
                elements={elements}
                activeElement={activeElement}
                setActiveElement={setActiveElement}
            />

            {/* TODO: add search bar, filters and columns*/}
            {/* <div></div> */}

            <ElementsContent
                elements={elements}
                activeElement={activeElement}
            />
        </div>
    );
};
