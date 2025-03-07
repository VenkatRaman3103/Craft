import "./index.scss";

export const MultiSelectPrompt = () => {
    const multiSelectValues = ["some", "some", "some"];

    return (
        <div className="multi-select-field-container">
            <div className="multi-select-field-wrapper">
                {multiSelectValues.map((item, ind) => (
                    <div
                        key={ind}
                        className={`multi-select-field ${multiSelectValues.length - 1 === ind ? "last" : ""}`}
                        // className={`multi-select-field`}
                    >
                        <label>
                            <input
                                type="checkbox"
                                value={"Hello world"}
                                readOnly
                                checked={true}
                            />
                            Hello world
                        </label>
                    </div>
                ))}
            </div>
            <div className="multi-select-field-btn">Add an Optioin</div>
        </div>
    );
};
