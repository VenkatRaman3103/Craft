import { useEffect, useState } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "@/store/ModalSlice";
import { RootState } from "@/store";
import { TextField } from "@/components/Forms/Fields/TextField";
import { TextareaField } from "@/components/Forms/Fields/TextareaField";
import { useCreateCollection } from "@/features/Collections/services/mutations";
import { ModalWrapper } from "@/features/Modals/Wrapper";
import { ModalHeader } from "@/features/Modals/Header";

export const NewCollectionModal = () => {
    const { referenceId, parentType } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    const [formData, setFormData] = useState<any>({});

    const crateCollection = useCreateCollection(parentType);

    const dispatch = useDispatch();

    function handleClose() {
        dispatch(toggleModal(false));
    }

    function handleFormDataChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSave() {
        crateCollection.mutate({ referenceId, ...formData });
    }

    return (
        <ModalWrapper>
            <ModalHeader label="New Collection" />

            <TextField
                label="Name"
                name="name"
                placeholder={"Collection Name"}
                description={
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                }
                updateFormData={handleFormDataChange}
            />

            <TextField
                label="Slug"
                name="slug"
                placeholder={"Collection Slug"}
                description={
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                }
                updateFormData={handleFormDataChange}
            />

            <TextareaField
                label="Description"
                name="description"
                placeholder={"Collection Description"}
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
                    Save
                </div>
            </div>
        </ModalWrapper>
    );
};
