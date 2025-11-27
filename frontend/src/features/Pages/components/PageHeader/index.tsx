import { Slug } from "@/components/ui/common/Slug";
import "./index.scss";
import { useDispatch } from "react-redux";
import {
    clickFromPage,
    toggleModal,
    updateModalType,
    updateReferenceId,
} from "@/store/ModalSlice";
import { AddItemBtn } from "@/components/ui/Buttons/AddItemBtn";
import { DualColorLabel } from "@/components/ui/common/DualColorLabel";
import { CommitBtn } from "@/components/ui/Buttons/CommitBtn";
import { useHandlePublish } from "../../handlers/handlePublish";

export const PageHeader = ({ data }: { data: any }) => {
    const dispatch = useDispatch();

    const handlePublish = useHandlePublish();

    function handleToggleModal(type: string) {
        dispatch(toggleModal(true));
        dispatch(updateModalType(type));
        dispatch(updateReferenceId(data.id));
        dispatch(clickFromPage());
    }

    function toggleCommitMessageModal() {
        dispatch(toggleModal(true));
        dispatch(updateModalType("commit-message"));
    }

    return (
        <div className="page-header-container">
            <h1 className="heading">{data.name}</h1>
            <Slug slug={data.slug} />
            <p className="description">{data.description}</p>

            <div className="data-info-wrapper">
                <DualColorLabel title="created_at" value={data.updated_at} />
                <DualColorLabel title="updated_at" value={data.created_at} />
            </div>

            <div className="page-header-action-btns">
                {/* <CommitBtn onClickFn={handlePublish} /> */}
                <CommitBtn onClickFn={toggleCommitMessageModal} />
                <AddItemBtn onClickFn={() => handleToggleModal("page-items")} />
                {/* <AddItemBtn onClickFn={toggleCommitMessageModal} /> */}
            </div>
        </div>
    );
};
