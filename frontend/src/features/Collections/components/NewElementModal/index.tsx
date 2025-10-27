import { TextField } from "@/components/Forms/Fields/TextField";
import { ModalHeader } from "@/features/Modals/Header";
import { ModalWrapper } from "@/features/Modals/Wrapper";
import { useState } from "react";
import { useCreatNewElement } from "../../services/mutations";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { SelectField } from "@/components/Forms/Fields/SelectField";
import { toggleModal } from "@/store/ModalSlice";

export const NewElementModal = () => {
    const [formData, setFormData] = useState<any>({});

    const { referenceId } = useSelector((state: RootState) => state.modalSlice);

    const createElement = useCreatNewElement(referenceId);

    const dispatch = useDispatch();

    function handleFormDataChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    console.log(formData, "formData");

    function handleClose() {
        dispatch(toggleModal(false));
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

            <SelectField
                label="Type"
                name="type"
                updateFormData={handleFormDataChange}
                options={[
                    {
                        name: "Collection",
                        value: "collection",
                        description:
                            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit Lorem ipsum dolor sit amet ",
                    },
                    {
                        name: "Page",
                        value: "page",
                        description:
                            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit Lorem ipsum dolor sit amet ",
                    },
                ]}
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
