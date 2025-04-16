import React, { JSX } from "react";

export const SideBar = ({ type }: { type: string | undefined }) => {
    function renderComponent(type: string | undefined): JSX.Element {
        switch (type) {
            case "cmp":
                return <div>Cmpl</div>;
            case "api":
                return <div>api</div>;
            case "db":
                return <div>DB</div>;
            case "save":
                return <div>Save</div>;
            case "tree":
                return <div>Tree</div>;
            default:
                return <div>invalid SideBar component</div>;
        }
    }

    return (
        <div>
            <div>{renderComponent(type)}</div>
        </div>
    );
};
