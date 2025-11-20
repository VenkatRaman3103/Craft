import { toggleModal } from "@/store/ModalSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createNewPage, createNewSection } from "./api";
import { NewPageType } from "../types/PagesType";

export const useCreateNewPage = (referenceId: string | undefined | null) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (obj: NewPageType) => {
            return createNewPage(obj);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [referenceId, "pages"],
            });

            queryClient.invalidateQueries({
                queryKey: ["structured-content"],
            });
            dispatch(toggleModal(false));
        },
    });
};

// sections
export const useCreateSection = (referenceId) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (obj) => {
            return createNewSection(obj);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["page", referenceId],
            });
            dispatch(toggleModal(false));
        },
    });
};
