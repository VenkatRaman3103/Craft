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
import {
    updateActiveElementId,
    updateActiveElementType,
} from "@/store/ElementSlice";

export const Elements = ({
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

    useEffect(() => {
        if (data.length > 0) {
            setActiveTabId(data[0].id);
            dispatch(updateActiveElementId(data[0].id));
        }
    }, []);

    function handleModal() {
        dispatch(toggleModal(!isModalActive));
        dispatch(updateModalType("element"));
        dispatch(updateReferenceId(referenceId));
    }

    function handleTabClick({
        tabId,
        elementType,
    }: {
        tabId: string;
        elementType: string;
    }) {
        setActiveTabId(tabId);
        dispatch(updateActiveElementId(tabId));
        dispatch(updateActiveElementType(elementType));
    }

    return (
        <div className="tabs-container">
            {data.map((e: any) => (
                <div
                    className={`tab ${activeTabId === e.id ? "active" : ""}`}
                    onClick={() =>
                        handleTabClick({ tabId: e.id, elementType: e.type })
                    }
                >
                    {e.name} - {e.type}
                </div>
            ))}

            <div className="tab add-new-tab" onClick={handleModal}>
                <Plus />
            </div>
        </div>
    );
};
