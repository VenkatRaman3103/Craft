import "./index.scss";
import { Section } from "../Section";

export const PageItems = ({ items }) => {
    function renderPageItems(item: any) {
        console.log(item, "items");
        switch (item.item_type) {
            case "section":
                return <Section {...item} />;
        }
    }

    return (
        <div className="page-items-container">
            {items.map((item) => renderPageItems(item))}
        </div>
    );
};
