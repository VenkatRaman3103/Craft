import { createNewCollectionUnderGroups } from "@/api/createNewCollection/underGroups";
import { toggleModal } from "@/store/ModalSlice";
import { NewCollectionType } from "@/type/NewCollection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

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
