import { formatDate } from "@/Utils/formateData";
import "./index.scss";
import { Json } from "../Buttons/Json";
import { Save } from "../Buttons/Save";
import { SideBarBtn } from "../Buttons/SideBarBtn";
import { SimpleTableBtn } from "../Buttons/SimpleTableBtn";
import { ComponentsBtn } from "../Buttons/ComponentsBtn";
import * as React from "react";

export const PageIntro = ({
    data,
    openSideBar,
    setOpenSideBar,
}: {
    data: any;
    openSideBar: boolean;
    setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
                        <ComponentsBtn />
                        <Json />
                        <SimpleTableBtn />
                        <Save />
                        <div onClick={() => setOpenSideBar(!openSideBar)}>
                            <SideBarBtn isActive={openSideBar} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
