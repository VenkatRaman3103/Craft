import { useSelector } from "react-redux";
import { PageItems } from "../PageItems";
import { PageSideBar } from "../PageSideBar";
import { RootState } from "@/store";

export const EditorPanel = () => {
    const { pageData } = useSelector((state: RootState) => state.pageSlice);

    return (
        <>
            <div className="page-content-area">
                <PageItems
                    items={pageData.items.filter(
                        (item) => item.position == "content",
                    )}
                />
            </div>

            <PageSideBar
                items={pageData.items.filter(
                    (item) => item.position == "sidebar",
                )}
            />
        </>
    );
};
