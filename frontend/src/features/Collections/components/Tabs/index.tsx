import { useState } from "react";
import { ElementsType } from "../../type/ElementsType";
import { useDispatch, useSelector } from "react-redux";
import {
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { RootState } from "@/store";
import { Plus } from "lucide-react";

export const Tabs = ({
    data,
    referenceId,
}: {
    data: ElementsType[];
    referenceId: string | undefined;
}) => {
    const [activeTabId, setActiveTabId] = useState(0);

    const dispatch = useDispatch();

    const { active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    function handleModal() {
        dispatch(toggleModal(!isModalActive));
        dispatch(updateModalType("element"));
        dispatch(updateReferenceId(referenceId));
    }

    return (
        <div className="tabs-container">
            {data.map((e: any, index: number) => (
                <div
                    className={`tab ${activeTabId === index ? "active" : ""}`}
                    onClick={() => setActiveTabId(index)}
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
