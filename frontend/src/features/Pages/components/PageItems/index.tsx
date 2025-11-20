import "./index.scss";

export const PageItems = ({ items }) => {
    function renderPageItems(type: string, name: string) {
        switch (type) {
            case "section":
                return (
                    <div className="section-container">
                        <div>{name}</div>
                    </div>
                );
        }
    }

    console.log(items, "<- items");

    return (
        <div className="page-items-container">
            {items.map((item) => (
                <div>{renderPageItems(item.item_type, item.name)}</div>
            ))}
        </div>
    );
};
