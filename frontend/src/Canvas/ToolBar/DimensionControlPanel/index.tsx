import { ControlPanelInput } from "@/Canvas";
import { elementsHash } from "@/Canvas/ElementPicker";
import { MetricSelection } from "@/Canvas/MetricSelector";
import { ControlPanelSelect } from "@/components/canvas/ControlPanelSelect";
import {
    updateElementMaxHeight,
    updateElementMaxWidth,
    updateElementMinHeight,
    updateElementMinWidth,
    updateElementOverFlow,
} from "@/store/toolbar/dimensionControl/dimensionControl";
import "./index.scss";

export const DimensionControlPanel = ({
    elementHeight,
    elementWidth,
    elementMaxWidth,
    elementMinWidth,
    elementMaxHeight,
    elementMinHeight,
    handleHeightChange,
    handleWidthChange,
    elementOverFlow,
    selectedElement,
    textWrap,
}: any) => {
    // const isTextElement =
    //     selectedElement?.type === "p" || selectedElement?.type === "h1";

    const isTextElement = elementsHash.text.includes(selectedElement?.type);

    const isDimensionDisabled = isTextElement && textWrap === "nowrap";

    return (
        <div className="dimenstion-cotainer toolbar-section">
            <div className="heading">Dimensions</div>
            <div className="dimenstion-wrapper">
                <div className="dimensions">
                    <div className="element-height dimension">
                        <label>H</label>
                        <div className="divider"></div>
                        <input
                            value={isDimensionDisabled ? "auto" : elementHeight}
                            type={isDimensionDisabled ? "text" : "number"}
                            className="dimension-field"
                            onChange={(e) =>
                                !isDimensionDisabled &&
                                handleHeightChange(Number(e.target.value))
                            }
                            disabled={isDimensionDisabled}
                            placeholder={isDimensionDisabled ? "auto" : ""}
                        />
                        <div className="divider"></div>
                        <MetricSelection />
                    </div>
                    <div className="element-width dimension">
                        <label>W</label>
                        <div className="divider"></div>
                        <input
                            value={isDimensionDisabled ? "auto" : elementWidth}
                            type={isDimensionDisabled ? "text" : "number"}
                            className="dimension-field"
                            onChange={(e) =>
                                !isDimensionDisabled &&
                                handleWidthChange(Number(e.target.value))
                            }
                            disabled={isDimensionDisabled}
                            placeholder={isDimensionDisabled ? "auto" : ""}
                        />
                        <div className="divider"></div>
                        <MetricSelection />
                    </div>
                    <div className="dimension">0</div>
                </div>
                {!isDimensionDisabled && (
                    <>
                        <div className="border-width-sub-section">
                            <div className="sub-heading">Max</div>
                            <div className="border-width-tools-container">
                                <div className="boder-width-adjustments-container">
                                    <div className="boder-width-adjustments">
                                        <ControlPanelInput
                                            value={elementMaxWidth}
                                            updateDispatch={
                                                updateElementMaxWidth
                                            }
                                        />
                                        <ControlPanelInput
                                            value={elementMaxHeight}
                                            updateDispatch={
                                                updateElementMaxHeight
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-width-sub-section">
                            <div className="sub-heading">Min</div>
                            <div className="border-width-tools-container">
                                <div className="boder-width-adjustments-container">
                                    <div className="boder-width-adjustments">
                                        <ControlPanelInput
                                            value={elementMinWidth}
                                            updateDispatch={
                                                updateElementMinWidth
                                            }
                                        />
                                        <ControlPanelInput
                                            value={elementMinHeight}
                                            updateDispatch={
                                                updateElementMinHeight
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <ControlPanelSelect
                    options={[
                        { value: "visible", label: "visible" },
                        { value: "hidden", label: "hidden" },
                        { value: "scroll", label: "scroll" },
                        { value: "auto", label: "auto" },
                    ]}
                    sectionTitle="Overflow"
                    elementStyle={elementOverFlow}
                    updateDispatch={updateElementOverFlow}
                />
            </div>
        </div>
    );
};
