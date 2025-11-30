import { SelectField } from "@/components/Forms/Fields/SelectField";
import { TextField } from "@/components/Forms/Fields/TextField";
import { Tabs } from "@/components/Tabs";
import { ModalHeader } from "@/features/Modals/Header";
import { ModalWrapper } from "@/features/Modals/Wrapper";
import { RootState } from "@/store";
import { toggleModal } from "@/store/ModalSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fieldTypeOptions } from "../../data/fieldTypeOptions";
import { updatePromptBucket } from "@/store/ItemsBucketSlice";
import { RadioFields } from "@/components/Forms/Fields/RadioFields";
import { sections_data, sections_pos_data } from "../../data/sections_data";
import { useCreateSection } from "../../service/mutation";

export const NewPageItemsModals = () => {
    const dispatch = useDispatch();

    const { promptBucket: bucket } = useSelector(
        (state: RootState) => state.itemsBucket,
    );

    const { referenceId, tab_items } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    const [activeTab, setActiveTab] = useState(tab_items[0]);
    const [formData, setFormData] = useState<any>({});

    const createNewSection = useCreateSection(referenceId);

    const handleFormDataChange = (e: any) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClose = () => {
        dispatch(toggleModal(false));
    };

    const handleSave = () => {
        if (activeTab === "Fields") {
            dispatch(updatePromptBucket({ key: referenceId, obj: formData }));
            return;
        }

        if (activeTab === "Sections") {
            createNewSection.mutate({ referenceId, ...formData });
            return;
        }
    };

    const renderFields = () => {
        switch (activeTab) {
            case "Blocks":
                return <div>coming soon...</div>;

            case "Fields":
                return (
                    <>
                        <TextField
                            label="Name"
                            name="name"
                            placeholder="Element Name"
                            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            updateFormData={handleFormDataChange}
                        />

                        <SelectField
                            label="Field type"
                            name="field_type"
                            options={fieldTypeOptions}
                            updateFormData={handleFormDataChange}
                        />
                    </>
                );

            case "Sections":
                return (
                    <>
                        <TextField
                            label="Name"
                            name="name"
                            placeholder="Element Name"
                            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                            updateFormData={handleFormDataChange}
                        />

                        <SelectField
                            label="Section type"
                            name="type"
                            options={sections_data}
                            updateFormData={handleFormDataChange}
                        />

                        <RadioFields
                            label="Position"
                            name="position"
                            options={sections_pos_data}
                            updateFormData={handleFormDataChange}
                        />
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <ModalWrapper>
            <ModalHeader label="New Page Items" />

            <Tabs
                tab_items={tab_items}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {renderFields()}

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
