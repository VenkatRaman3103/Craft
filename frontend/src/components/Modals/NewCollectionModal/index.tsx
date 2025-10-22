import React, { useEffect } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleModal } from "@/store/ModalSlice";

export const NewCollectionModal = () => {
    const { active: isModalActive } = useSelector(
        (state: RootState) => state.modalSlice,
    );

    const dispatch = useDispatch();

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    function handleClickOutside() {
        dispatch(toggleModal(false));
    }

    return (
        <div
            className="new-collection-modal-overlay"
            onClick={handleClickOutside}
        >
            <div
                className="new-collection-modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header modal-section">
                    <div>Add new Collection</div>
                </div>

                <div className="modal-section">
                    <label>Name</label>
                    <input type="text" placeholder="Collection Name" />
                    <div className="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </div>
                </div>

                <div className="modal-section">
                    <label>Slug</label>
                    <input type="text" placeholder="Collection Slug" />
                    <div className="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </div>
                </div>

                <div className="modal-section">
                    <label>Description</label>
                    <textarea
                        placeholder="Collection Description"
                        className="description-textarea"
                    />
                    <div className="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </div>
                </div>

                <div className="modal-action-button-wrapper">
                    <div className="action-button" onClick={handleClickOutside}>
                        Cancel
                    </div>
                    <div className="action-button save">Save</div>
                </div>
            </div>
        </div>
    );
};
