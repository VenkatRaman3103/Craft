import { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getElementsByCollectionId } from "./services/api";

export const Elements = () => {
    const { activeCollectionId } = useSelector(
        (state: RootState) => state.collectionSlice,
    );

    const { data: elementsData } = useQuery({
        queryFn: () => getElementsByCollectionId(activeCollectionId),
        queryKey: ["elements", activeCollectionId],
    });

    const [activeTabId, setActiveTabId] = useState<string | null>(null);

    const dispatch = useDispatch();

    const { active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    useEffect(() => {
        if (elementsData && elementsData.length > 0) {
            const first = elementsData[0];
            setActiveTabId(first?.id);
            dispatch(updateActiveElementId(first?.id));
            dispatch(updateActiveElementType(first?.type));
        }
    }, [elementsData]);

    function handleModal() {
        dispatch(toggleModal(!isModalActive));
        dispatch(updateModalType("element"));
        dispatch(updateReferenceId(activeCollectionId));
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
            {elementsData?.map((e: any) => (
                <div
                    key={e.id}
                    className={`tab ${activeTabId === e.id ? "active" : ""}`}
                    onClick={() =>
                        handleTabClick({ tabId: e.id, elementType: e.type })
                    }
                >
                    {e.name} ({e.type})
                </div>
            ))}

            <div className="tab add-new-tab" onClick={handleModal}>
                <Plus />
            </div>
        </div>
    );
};
