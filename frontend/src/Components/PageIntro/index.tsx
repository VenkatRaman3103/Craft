import { formatDate } from "@/Utils/formateData";
import "./index.scss";
import { FileJson2 } from "lucide-react";
import { lightFont } from "@/Styles/base";

export const PageIntro = ({ data }: { data: any }) => {
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

                    <div className="json-object-btn">
                        <FileJson2 size={18} color={lightFont} />
                        <div className="json-object-btn-text">JSON</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
