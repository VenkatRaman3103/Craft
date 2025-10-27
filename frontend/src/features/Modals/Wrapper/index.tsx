import { toggleModal } from "@/store/ModalSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./index.scss";

export const ModalWrapper = ({ children }: any) => {
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
        <div className="modal-overlay" onClick={handleClickOutside}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};
