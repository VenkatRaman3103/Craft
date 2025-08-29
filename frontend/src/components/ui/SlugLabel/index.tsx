import { Copy } from "lucide-react";

import "./index.scss";

export const SlugLabel = ({ label }: { label: string }) => {
    return (
        <p className="slug-label">
            slug:{" "}
            <span>
                {label}
                <Copy size={13} strokeWidth={2.25} className="copy-icon" />
            </span>
        </p>
    );
};
