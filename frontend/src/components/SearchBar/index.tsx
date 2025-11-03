import { Search } from "lucide-react";
import "./index.scss";

export const SearchBar = () => {
    return (
        <div className="search-bar-container">
            <div className="search-bar-wrapper">
                <div className="search-bar-icon">
                    <Search size={18} />
                </div>
                <input type="text" className="search-bar-input"></input>
            </div>
        </div>
    );
};
