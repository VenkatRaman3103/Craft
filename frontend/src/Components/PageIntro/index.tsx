import { formatDate } from "@/Utils/formateData";
import "./index.scss";
import { Json } from "../Buttons/Json";
import { Save } from "../Buttons/Save";
import { SideBarBtn } from "../Buttons/SideBarBtn";
import { SimpleTableBtn } from "../Buttons/SimpleTableBtn";
import { ComponentsBtn } from "../Buttons/ComponentsBtn";
import * as React from "react";
import { darkFont, lightFont } from "@/Styles/base";

export const PageIntro = ({
    data,
    openSideBar,
    setOpenSideBar,
    setSideBarComponent,
    sideBarComponent,
}: {
    data: any | undefined;
    openSideBar: boolean;
    setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
    setSideBarComponent: React.Dispatch<
        React.SetStateAction<string | undefined>
    >;
    sideBarComponent: string | undefined;
}) => {
    function sideBarComponentSelection(type) {
        setOpenSideBar(true);
        setSideBarComponent(type);

        if (sideBarComponent == type) {
            setOpenSideBar(false);
        }
    }

    const BtnWrapper = ({
        children,
        type,
    }: {
        children: React.ReactNode;
        type: string | undefined;
    }) => {
        return (
            <div
                onClick={() => {
                    sideBarComponentSelection(type);
                }}
            >
                {children}
            </div>
        );
    };

    return (
        <div className="page-intro-container">
            <div className="page-heading-slug-wrapper">
                <div className="page-heading">{data?.title}</div>
                <div className="slug-wrapper">
                    <div className="page-slug-label">{`slug: `}</div>
                    <div className="page-slug-text"> {data?.slug}</div>
                </div>
            </div>
            <div className="utils-section-container">
                <div className="utils-section-wrapper">
                    <div className="time-stamp-container">
                        <div className="created-at">
                            <span>Created At:</span>{" "}
                            {formatDate(data?.created_at)}
                        </div>
                        <div className="edited-at">
                            <span>Last Edited At: </span>
                            {formatDate(data?.edited_at)}
                        </div>
                    </div>
                    <div className="utils-actions-btns">
                        <BtnWrapper type={"cmp"}>
                            <ComponentsBtn
                                isActive={sideBarComponent == "cmp"}
                                iconColor={
                                    sideBarComponent == "cmp"
                                        ? darkFont
                                        : lightFont
                                }
                                labelColor={
                                    sideBarComponent == "cmp"
                                        ? darkFont
                                        : lightFont
                                }
                            />
                        </BtnWrapper>

                        <BtnWrapper type={"api"}>
                            <Json
                                isActive={sideBarComponent == "api"}
                                iconColor={
                                    sideBarComponent == "api"
                                        ? darkFont
                                        : lightFont
                                }
                                labelColor={
                                    sideBarComponent == "api"
                                        ? darkFont
                                        : lightFont
                                }
                            />
                        </BtnWrapper>

                        <BtnWrapper type={"db"}>
                            <SimpleTableBtn
                                isActive={sideBarComponent == "db"}
                                iconColor={
                                    sideBarComponent == "db"
                                        ? darkFont
                                        : lightFont
                                }
                                labelColor={
                                    sideBarComponent == "db"
                                        ? darkFont
                                        : lightFont
                                }
                            />
                        </BtnWrapper>
                        <BtnWrapper type={"save"}>
                            <Save
                                isActive={sideBarComponent == "save"}
                                iconColor={
                                    sideBarComponent == "save"
                                        ? darkFont
                                        : lightFont
                                }
                                labelColor={
                                    sideBarComponent == "save"
                                        ? darkFont
                                        : lightFont
                                }
                            />
                        </BtnWrapper>
                        <BtnWrapper type={"tree"}>
                            <SideBarBtn
                                isActive={sideBarComponent == "tree"}
                                iconColor={
                                    sideBarComponent == "tree"
                                        ? darkFont
                                        : lightFont
                                }
                                labelColor={
                                    sideBarComponent == "tree"
                                        ? darkFont
                                        : lightFont
                                }
                            />
                        </BtnWrapper>
                    </div>
                </div>
            </div>
        </div>
    );
};
