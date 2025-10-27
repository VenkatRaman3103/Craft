import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { CollectionHeader } from "@/features/Collections/components/CollectionHeader";
import { getCollection } from "@/features/Collections/services/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import "./index.scss";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { RenderModal } from "@/features/Modals/RenderModal";
import {
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";

export const CollectionPage = () => {
    const { collection_id } = useParams();

    const [activeTabId, setActiveTabId] = useState(1);

    const { data: collectionData } = useQuery({
        queryKey: ["collection", collection_id],
        queryFn: () => getCollection(collection_id),
    });

    const { active: isModalActive, type: modalType } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    const dispatch = useDispatch();

    if (!collectionData) {
        return <div>collection data loading...</div>;
    }

    function handleModal() {
        dispatch(toggleModal(!isModalActive));
        dispatch(updateModalType("element"));
        dispatch(updateReferenceId(collection_id));
    }

    console.log(collection_id, collectionData, "collectionData");

    return (
        <>
            <TopBar />
            <SideBar />
            <div className="page">
                <CollectionHeader data={collectionData} />
            </div>
            <div className="tabs-container">
                {collectionData.elements.map((e: any, index: number) => (
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
            <div className="page-content">
                <div className="action-buttons">
                    <div className="search-bar">search bar</div>
                    <div className="filter-button">filter button</div>
                    <div className="columns-button">columns button</div>
                </div>
            </div>

            {isModalActive && <RenderModal type={modalType} />}
        </>
    );
};
