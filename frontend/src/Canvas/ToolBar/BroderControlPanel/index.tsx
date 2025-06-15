import "./index.scss";

import {
    updateBoderRadius,
    updateRightWidth,
    updateLeftWidth,
    updateBottomWidth,
    updateTopWidth,
    updateElementBoderWidth,
    updateBottomLeftRadius,
    updateBottomRightRadius,
    updateTopRightRadius,
    updateTopLeftRadius,
    updateBorderStyle,
} from "@/store/toolbar/borderControl/borderControl";

import {
    Minus,
    Scan,
    Square,
    SquareDashed,
    SquareDashedTopSolid,
    SquareRoundCorner,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { StoreState } from "@/store/store";
import { useEffect } from "react";
import { ControlPanelSelect } from "@/Canvas";

export const BorderControlPanel = ({
    toggleAllSide_radius,
    toggleAllSide_width,

    setToggleAllSide_radius,
    setToggleAllSide_width,
}: any) => {
    const borderIconSize = 16;

    const {
        elementRadius,

        topLeftRadius,
        topRightRadius,
        bottomRightRadius,
        bottomLeftRadius,

        elementBoderWidth,

        topWidth,
        bottomWidth,
        leftWidth,
        rightWidth,

        borderStyle,
    } = useSelector((state: StoreState) => state.borderControl);
    const dispatch = useDispatch();

    useEffect(() => {
        if (toggleAllSide_radius == "specific") {
            dispatch(updateBoderRadius(0));
        } else {
            dispatch(updateTopLeftRadius(0));
            dispatch(updateTopRightRadius(0));
            dispatch(updateBottomRightRadius(0));
            dispatch(updateBottomLeftRadius(0));
        }
    }, [toggleAllSide_radius]);

    useEffect(() => {
        if (toggleAllSide_width == "specific") {
            dispatch(updateElementBoderWidth(1));
        } else {
            dispatch(updateTopWidth(1));
            dispatch(updateBottomWidth(1));
            dispatch(updateLeftWidth(1));
            dispatch(updateRightWidth(1));
        }
    }, [toggleAllSide_width]);

    return (
        <div className="border-section-container toolbar-section">
            <div className="heading">border</div>
            <div className="border-tools-container">
                <div className="border-width-sub-section">
                    <div className="sub-heading">width</div>
                    <div className="border-width-tools-container">
                        <div className="boder-width-adjustments-container">
                            <div className="boder-width-adjustments">
                                <div className="border-width border-tool">
                                    <div className="border-width-icon">
                                        <Minus size={borderIconSize} />
                                    </div>
                                    <input
                                        type="number"
                                        value={elementBoderWidth}
                                        onChange={(e) =>
                                            dispatch(
                                                updateElementBoderWidth(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="boder-width-sides-toggle">
                                <div
                                    className={`all-sides ${toggleAllSide_width == "all" ? "active" : ""}`}
                                    onClick={() =>
                                        setToggleAllSide_width("all")
                                    }
                                >
                                    <Square size={borderIconSize} />
                                </div>
                                <div
                                    className={`target-sides ${toggleAllSide_width == "specific" ? "active" : ""}`}
                                    onClick={() =>
                                        setToggleAllSide_width("specific")
                                    }
                                >
                                    <SquareDashed size={borderIconSize} />
                                </div>
                            </div>
                        </div>
                        {toggleAllSide_width == "specific" && (
                            <div className="boder-width-specific-sides-selection">
                                <div className="top-side-wrapper border-sides border-tool">
                                    <div className="top-border-wraper">
                                        <SquareDashedTopSolid
                                            className="top-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={topWidth}
                                        onChange={(e) =>
                                            dispatch(
                                                updateTopWidth(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                    />
                                </div>
                                <div className="bottom-side-wrapper border-sides border-tool">
                                    <div className="bottom-border-wraper">
                                        <SquareDashedTopSolid
                                            className="bottom-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={bottomWidth}
                                        onChange={(e) =>
                                            dispatch(
                                                updateBottomWidth(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                    />
                                </div>
                                <div className="left-side-wrapper border-sides border-tool">
                                    <div className="left-border-wraper">
                                        <SquareDashedTopSolid
                                            className="left-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={leftWidth}
                                        onChange={(e) =>
                                            dispatch(
                                                updateLeftWidth(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                    />
                                </div>
                                <div className="right-side-wrapper border-sides border-tool">
                                    <div className="right-border-wraper">
                                        <SquareDashedTopSolid
                                            className="right-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={rightWidth}
                                        onChange={(e) =>
                                            dispatch(
                                                updateRightWidth(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <ControlPanelSelect
                    options={[
                        { value: "solid", label: "solid" },
                        { value: "dotted", label: "dotted" },
                        { value: "dashed", label: "dashed" },
                        { value: "double", label: "double" },
                        { value: "groove", label: "groove" },
                        { value: "ridge", label: "ridge" },
                        { value: "inset", label: "inset" },
                        { value: "outset", label: "outset" },
                        { value: "none", label: "none" },
                        { value: "hidden", label: "hidden" },
                    ]}
                    sectionTitle="Style"
                    elementStyle={borderStyle}
                    updateDispatch={updateBorderStyle}
                />

                <div className="border-radius-sub-section">
                    <div className="sub-heading">radius</div>
                    <div className="border-radius-tools-container">
                        <div className="boder-radius-adjustments-container">
                            <div className="boder-radius-adjustments">
                                <div className="border-radius border-tool">
                                    <div className="border-radius-icon">
                                        <SquareRoundCorner
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            dispatch(
                                                updateBoderRadius(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                        value={elementRadius}
                                    />
                                </div>
                            </div>
                            <div className="boder-radius-sides-toggle">
                                <div
                                    className={`all-sides ${toggleAllSide_radius == "all" ? "active" : ""}`}
                                    onClick={() =>
                                        setToggleAllSide_radius("all")
                                    }
                                >
                                    <Square size={borderIconSize} />
                                </div>
                                <div
                                    className={`target-sides ${toggleAllSide_radius == "specific" ? "active" : ""}`}
                                    onClick={() =>
                                        setToggleAllSide_radius("specific")
                                    }
                                >
                                    <Scan size={borderIconSize} />
                                </div>
                            </div>
                        </div>
                        {toggleAllSide_radius == "specific" && (
                            <div className="boder-radius-specific-sides-selection">
                                <div className="top-side-wrapper border-sides border-tool">
                                    <div className="top-border-wraper">
                                        <SquareRoundCorner
                                            className="top-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={topLeftRadius}
                                        onChange={(e) =>
                                            dispatch(
                                                updateTopLeftRadius(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                    />
                                </div>
                                <div className="bottom-side-wrapper border-sides border-tool">
                                    <div className="bottom-border-wraper">
                                        <SquareRoundCorner
                                            className="bottom-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={topRightRadius}
                                        onChange={(e) =>
                                            dispatch(
                                                updateTopRightRadius(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                    />
                                </div>
                                <div className="left-side-wrapper border-sides border-tool">
                                    <div className="left-border-wraper">
                                        <SquareRoundCorner
                                            className="left-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={bottomLeftRadius}
                                        onChange={(e) =>
                                            dispatch(
                                                updateBottomLeftRadius(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                    />
                                </div>
                                <div className="right-side-wrapper border-sides border-tool">
                                    <div className="right-border-wraper">
                                        <SquareRoundCorner
                                            className="right-border"
                                            size={borderIconSize}
                                        />
                                    </div>
                                    <input
                                        type="number"
                                        value={bottomRightRadius}
                                        onChange={(e) =>
                                            dispatch(
                                                updateBottomRightRadius(
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
