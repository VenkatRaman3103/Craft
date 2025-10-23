import { NewCollectionType } from "@/type/NewCollection";

export async function createNewCollectionUnderGroups(obj: NewCollectionType) {
    try {
        console.log(obj, "obj");
    } catch (error) {
        const errorMessage = {
            origin: "createNewCollectionUnderGroups",
            error: error,
        };

        return errorMessage;
    }

    return {};
}
