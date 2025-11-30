import { SelectField } from "@/components/Forms/Fields/SelectField";
import { TextField } from "@/components/Forms/Fields/TextField";
import { Tabs } from "@/components/Tabs";
import { ModalHeader } from "@/features/Modals/Header";
import { ModalWrapper } from "@/features/Modals/Wrapper";
import { RootState } from "@/store";
import { toggleModal } from "@/store/ModalSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sections_data, sections_pos_data } from "../../data/sections_data";
import { useCreateSection } from "../../service/mutation";
import { RadioFields } from "@/components/Forms/Fields/RadioFields";
import { fieldTypeOptions } from "../../data/fieldTypeOptions";

export const NewPageItemsModals = () => {
    const [formData, setFormData] = useState<any>({});

    const { referenceId } = useSelector((state: RootState) => state.modalSlice);

    const { tab_items } = useSelector((state: RootState) => state.modalSlice);
    const [activeTab, setActiveTab] = useState(tab_items[0]);

    const createNewSection = useCreateSection(referenceId);

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

    function renderItems(itemType) {
        switch (itemType) {
            case "Blocks":
                return <div>comming soon...</div>;
            case "Fields":
                return (
                    <>
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
                            label={"field type"}
                            name={"field_type"}
                            options={fieldTypeOptions}
                            updateFormData={handleFormDataChange}
                        />
                    </>
                );
        }
    }

    return (
        <ModalWrapper>
            <ModalHeader label="New Page Items" />
            <Tabs
                tab_items={tab_items}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {renderItems(activeTab)}

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
