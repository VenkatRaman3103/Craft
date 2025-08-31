import "./index.scss";

type Props = {
    activeElement: number;
    setActiveElement: React.Dispatch<React.SetStateAction<number>>;
    elements: any;
};

export const ElementsTab = ({
    activeElement,
    setActiveElement,
    elements,
}: Props) => {
    return (
        <div className="elements-tabs">
            {elements?.map((element: any, ind: number) => (
                <div
                    className={`tab ${activeElement === ind ? "active" : ""}`}
                    onClick={() => setActiveElement(ind)}
                >
                    {element.name}
                </div>
            ))}
        </div>
    );
};
