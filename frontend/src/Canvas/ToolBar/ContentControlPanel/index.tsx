import { ControlPanelSelect } from "@/components/canvas/ControlPanelSelect";
import { updateTextWrap } from "@/store/toolbar/contentControl/contentControl";
import "./index.scss";

export const ContentControlPanel = ({
    elementContent,
    handleContentChange,
    textWrap,
    handleTextWrapChange,
    selectedElement,
}: {
    elementContent: string;
    handleContentChange: (value: string) => void;
    textWrap: string;
    handleTextWrapChange: (value: string) => void;
    selectedElement: any;
}) => {
    const isTextElement =
        selectedElement?.type === "p" || selectedElement?.type === "h1";

    return (
        <div className="content-section-container toolbar-section">
            <div className="heading">Content</div>
            <div className="content-sub-section-container">
                <div className="content-field-container">
                    <label>Text</label>
                    <textarea
                        value={elementContent}
                        className="content-textarea"
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="Enter text content..."
                        rows={3}
                    />
                </div>

                {isTextElement && (
                    <ControlPanelSelect
                        options={[
                            { value: "normal", label: "Wrap" },
                            { value: "nowrap", label: "No Wrap" },
                            { value: "pre", label: "Pre" },
                            { value: "pre-wrap", label: "Pre Wrap" },
                            { value: "pre-line", label: "Pre Line" },
                        ]}
                        sectionTitle="Text Wrap"
                        elementStyle={textWrap}
                        updateDispatch={updateTextWrap}
                    />
                )}
            </div>
        </div>
    );
};
