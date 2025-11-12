import { NewContent } from "../ActionButtons/NewContent";
import { SearchBar } from "../SearchBar";
import "./index.scss";

export const ContentHeader = () => {
    return (
        <div className="action-buttons">
            <SearchBar />
            {/* <div className="filter-button">filter button</div> */}
            {/* <div className="columns-button">columns button</div> */}
            <NewContent />
        </div>
    );
};
