import { toggleModal } from "@/store/ModalSlice";
import { NewCollectionType } from "@/type/NewCollection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createNewCollectionUnderGroups, createNewElement } from "./api";
import { NewElementType } from "@/type/NewElementType";

export function useCreateCollection() {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (obj: NewCollectionType) =>
            createNewCollectionUnderGroups(obj),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            dispatch(toggleModal(false));
        },
    });
}

export const useCreatNewElement = (referenceId: string | undefined | null) => {
    console.log(referenceId, "referenceId");

    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (obj: NewElementType) => createNewElement(obj),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["collection", referenceId],
            });
            queryClient.invalidateQueries({
                queryKey: ["structured-content"],
            });
            dispatch(toggleModal(false));
        },
    });
};
