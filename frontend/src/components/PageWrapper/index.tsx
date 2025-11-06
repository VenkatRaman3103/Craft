import { SideBar } from "@/features/SideBar/components";
import { TopBar } from "../TopBar";

export const PageWrapper = ({ children }: any) => {
    return (
        <>
            <TopBar />
            <div className="main-container">
                <SideBar />
                <div className="main-wrapper">{children}</div>
            </div>
        </>
    );
};
