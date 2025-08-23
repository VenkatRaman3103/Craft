import { ReactNode } from "react";
import "./index.scss";

type Props = { children: ReactNode };

export const Layout = ({ children }: Props) => {
    return (
        <div className="gutter">
            <div className="content">{children}</div>
        </div>
    );
};
