import { field } from "@/Types/fields";
import "./index.scss";
import { EllipsisVertical, PencilLine } from "lucide-react";
import { lightFont } from "@/Styles/base";
import * as React from "react";

export const FieldWrapper = ({
    children,
    data,
}: {
    data: field;
    children: React.ReactNode;
}) => {
    console.log(data, "dataText");
    return (
        <div className="text-field-container">
            <div className="text-field-header-contianer">
                <div className="text-field-header-wrapper">
                    <div className="text-field-heading-container">
                        <div className="text-field-label">{data.label}</div>
                        <div className="text-field-type">/ {data.type}</div>
                    </div>
                    <div className="text-field-actions">
                        <div className="text-field-edit">
                            <PencilLine size={16} color={lightFont} />
                        </div>
                        <div className="text-field-more">
                            <EllipsisVertical size={16} color={lightFont} />
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
};
