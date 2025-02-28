import { formatDate } from "@/Utils/formateData";
import "./index.scss";

export const PageIntro = ({ data }) => {
    return (
        <div className="page-intro-container">
            <div className="page-heading-slug-wrapper">
                <div className="page-heading">{data?.title}</div>
                <div className="slug-wrapper">
                    <div className="page-slug-label">{`slug: `}</div>
                    <div className="page-slug-text"> {data?.slug}</div>
                </div>
            </div>
            <div className="time-stamps-container">
                <div className="time-stamps-wrapper">
                    <div className="created-at">
                        <span>Created At:</span> {formatDate(data?.created_at)}
                    </div>
                    <div className="edited-at">
                        <span>Last Edited At: </span>
                        {formatDate(data?.edited_at)}
                    </div>
                </div>
            </div>
        </div>
    );
};
