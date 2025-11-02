import { useEffect, useState } from "react";
import { ElementsType } from "../../type/ElementsType";
import { useDispatch, useSelector } from "react-redux";
import {
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { RootState } from "@/store";
import { Plus } from "lucide-react";
import "./index.scss";
import { updateActiveElementId } from "@/store/ElementSlice";

export const Tabs = ({
    data,
    referenceId,
}: {
    data: ElementsType[];
    referenceId: string | undefined;
}) => {
    const [activeTabId, setActiveTabId] = useState<string | null>(null);

    const dispatch = useDispatch();

    const { active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    // const {}

    useEffect(() => {
        setActiveTabId(data[0].id);
        dispatch(updateActiveElementId(data[0].id));
    }, []);

    function handleModal() {
        dispatch(toggleModal(!isModalActive));
        dispatch(updateModalType("element"));
        dispatch(updateReferenceId(referenceId));
    }

    function handleTabClick(tabId: string) {
        setActiveTabId(tabId);
        dispatch(updateActiveElementId(tabId));
    }

    return (
        <div className="tabs-container">
            {data.map((e: any) => (
                <div
                    className={`tab ${activeTabId === e.id ? "active" : ""}`}
                    onClick={() => handleTabClick(e.id)}
                >
                    {e.name}
                </div>
            ))}

            <div className="tab add-new-tab" onClick={handleModal}>
                <Plus />
            </div>
        </div>
    );
};
