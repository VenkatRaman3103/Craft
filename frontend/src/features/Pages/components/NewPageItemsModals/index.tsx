import { SelectField } from "@/components/Forms/Fields/SelectField";
import { TextField } from "@/components/Forms/Fields/TextField";
import { Tabs } from "@/components/Tabs";
import { ModalHeader } from "@/features/Modals/Header";
import { ModalWrapper } from "@/features/Modals/Wrapper";
import { RootState } from "@/store";
import { toggleModal } from "@/store/ModalSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sections_data } from "../../data/sections_data";
import { useCreateSection } from "../../service/mutation";
import { RadioFields } from "@/components/Forms/Fields/RadioFields";

export const NewPageItemsModals = () => {
    const [formData, setFormData] = useState<any>({});

    const { referenceId } = useSelector((state: RootState) => state.modalSlice);

    const createNewSection = useCreateSection();

    const dispatch = useDispatch();

    function handleFormDataChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleClose() {
        dispatch(toggleModal(false));
    }

    function handleSave() {
        createNewSection.mutate({ referenceId, ...formData });
    }

    return (
        <ModalWrapper>
            <ModalHeader label="New Page Items" />
            <Tabs />
            <TextField
                label="Name"
                name="name"
                placeholder={"Element Name"}
                description={
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit."
                }
                updateFormData={handleFormDataChange}
            />
            <SelectField
                label="Section type"
                name="type"
                options={sections_data}
                updateFormData={handleFormDataChange}
            />
            <RadioFields
                label="Section type"
                name="type"
                options={sections_data}
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
