import { createNewCollectionUnderGroups } from "@/api/createNewCollection/underGroups";
import { NewCollectionType } from "@/type/NewCollection";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCollection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (obj: NewCollectionType) =>
            createNewCollectionUnderGroups(obj),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
}
