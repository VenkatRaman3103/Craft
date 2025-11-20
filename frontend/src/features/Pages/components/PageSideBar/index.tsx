import "./index.scss";
import { Section } from "../Section";

export const PageSideBar = ({ items }) => {
    if (items.length == 0) {
        return <div>No data on side bar</div>;
    }

    return (
        <div className="page-sidebar">
            {items.map((item) => {
                return <Section {...item} />;
            })}
        </div>
    );
};
