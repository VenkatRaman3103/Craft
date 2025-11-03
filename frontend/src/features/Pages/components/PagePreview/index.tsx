import { Slug } from "@/components/ui/common/Slug";
import { PageIcon } from "@/components/ui/Icons/PageIcon";
import { Copy } from "lucide-react";
import { PagesType } from "../../types/PagesType";
import "./index.scss";

export const PagePreview = ({ page }: { page: PagesType }) => {
    return (
        <div className="page-preview-cotainer">
            <div className="page-preview-wrapper">
                <div className="page-preview-header">
                    <div className="name-icon-wrap">
                        <div className="icon">
                            <PageIcon />
                        </div>
                        <h3 className="name">{page.name}</h3>
                    </div>
                    <div className="slug-area">
                        <Slug slug={page.slug} />
                        <Copy size={14} className="copy-btn" />
                    </div>
                </div>
                <div className="page-description">{page.description}</div>
            </div>
        </div>
    );
};
