import { toggleModal } from "@/store/ModalSlice";
import { NewCollectionType } from "@/type/NewCollection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
    createNewCollectionUnderElement,
    createNewCollectionUnderGroups,
    createNewElement,
} from "./api";
import { NewElementType } from "@/type/NewElementType";

export function useCreateCollection(parentType: string) {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (obj: NewCollectionType) =>
            parentType == "group"
                ? createNewCollectionUnderGroups(obj)
                : createNewCollectionUnderElement(obj),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            dispatch(toggleModal(false));
        },
    });
}

export const useCreatNewElement = (referenceId: string | undefined | null) => {
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
