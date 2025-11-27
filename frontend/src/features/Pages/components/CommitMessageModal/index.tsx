import { ModalHeader } from "@/features/Modals/Header";
import { ModalWrapper } from "@/features/Modals/Wrapper";
import { RootState } from "@/store";
import { toggleModal } from "@/store/ModalSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useCreateNewPage,
    useCreateNewPageVersion,
} from "../../service/mutation";
import { TextareaField } from "@/components/Forms/Fields/TextareaField";
import { useParams } from "react-router";

export const CommitMessageModal = () => {
    const { page_id } = useParams();
    const [formData, setFormData] = useState<any>({});

    const { activeElementId: referenceId } = useSelector(
        (state: RootState) => state.elementSlice,
    );
    const { pageData } = useSelector((state: RootState) => state.pageSlice);

    const createPage = useCreateNewPage(referenceId);
    const createNewVersion = useCreateNewPageVersion(page_id);

    const dispatch = useDispatch();

    function handleFormDataChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleClose() {
        dispatch(toggleModal(false));
    }

    function handleSave() {
        createPage.mutate({ element_id: referenceId, ...formData });

        const now = new Date();

        const obj = {
            page_id,
            page_data: pageData,
            published_at: now.getTime(),
            created_by: "venkat",
            message: formData.message,
        };

        createNewVersion.mutate(obj);
    }

    return (
        <ModalWrapper>
            <ModalHeader label="Commit Message" />
            <TextareaField
                label="Message"
                name="message"
                placeholder={"Enter the commit message..."}
                description={
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                }
                updateFormData={handleFormDataChange}
            />

            <div className="modal-action-button-wrapper">
                <div className="action-button" onClick={handleClose}>
                    Cancel
                </div>
                <div className="action-button save" onClick={handleSave}>
                    Commit
                </div>
            </div>
        </ModalWrapper>
    );
};
