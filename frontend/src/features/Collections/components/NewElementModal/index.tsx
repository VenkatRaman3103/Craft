import { TextField } from "@/components/Forms/Fields/TextField";
import { ModalHeader } from "@/features/Modals/Header";
import { ModalWrapper } from "@/features/Modals/Wrapper";
import { useState } from "react";
import { useCreatNewElement } from "../../services/mutations";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export const NewElementModal = () => {
    const [formData, setFormData] = useState<any>({});

    const { referenceId } = useSelector((state: RootState) => state.modalSlice);

    const createElement = useCreatNewElement(referenceId);

    function handleFormDataChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    console.log(formData, "formData");

    function handleClose() {
        //
    }

    function handleSave() {
        createElement.mutate({ referenceId, ...formData });
    }

    return (
        <ModalWrapper>
            <ModalHeader label="New Element" />
            <TextField
                label="Name"
                name="name"
                placeholder={"Element Name"}
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
