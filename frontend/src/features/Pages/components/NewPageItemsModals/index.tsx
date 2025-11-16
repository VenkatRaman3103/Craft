import { TextareaField } from "@/components/Forms/Fields/TextareaField";
import { TextField } from "@/components/Forms/Fields/TextField";
import { ModalHeader } from "@/features/Modals/Header";
import { ModalWrapper } from "@/features/Modals/Wrapper";
import { RootState } from "@/store";
import { toggleModal } from "@/store/ModalSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const NewPageItemsModals = () => {
    const [formData, setFormData] = useState<any>({});

    const { activeElementId: referenceId } = useSelector(
        (state: RootState) => state.elementSlice,
    );

    const dispatch = useDispatch();

    function handleFormDataChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleClose() {
        dispatch(toggleModal(false));
    }

    function handleSave() {
        //
    }

    return (
        <ModalWrapper>
            <ModalHeader label="New Page Items" />
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
