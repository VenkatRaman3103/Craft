import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { backendUrl } from "@/config";
import { getPageElements } from "@/api/canvas/pages/getPageElements";
import { CanvasElement } from "@/Types/canvas/CanvasElement";

interface UseCanvasApiProps {
    pageId: string | undefined;
    onElementCreate?: (elementId: string | number) => void;
    onElementUpdate?: () => void;
    onElementDelete?: (elementId: string | number) => void;
}

export const useCanvasApi = ({
    pageId,
    onElementCreate,
    onElementUpdate,
    onElementDelete,
}: UseCanvasApiProps) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryFn: () => getPageElements(pageId),
        queryKey: ["canvas_page", pageId],
        enabled: !!pageId,
    });

    const updateElementMutation = useMutation({
        mutationFn: async ({
            elementId,
            styles,
        }: {
            elementId: string | number;
            styles: any;
        }) => {
            const response = await axios.patch(
                `${backendUrl}/canvas/pages/elements/${elementId}`,
                { styles },
            );
            return response.data;
        },
        onSuccess: () => {
            refetch();
            onElementUpdate?.();
        },
        onError: (error) => {
            console.error("Error updating element:", error);
        },
    });

    const deleteElementMutation = useMutation({
        mutationFn: async (elementId: string | number) => {
            const response = await axios.delete(
                `${backendUrl}/canvas/pages/elements/${elementId}`,
            );
            return response.data;
        },
        onSuccess: (_, elementId) => {
            refetch();
            onElementDelete?.(elementId);
        },
        onError: (error) => {
            console.error("Error deleting element:", error);
        },
    });

    const createElementMutation = useMutation({
        mutationFn: async (elementData: any) => {
            const response = await axios.post(
                `${backendUrl}/canvas/pages/elements/${pageId}`,
                { elementData },
            );
            return response.data;
        },
        onSuccess: (data) => {
            refetch();
            if (data?.id) {
                onElementCreate?.(data.id);
            }
        },
        onError: (error) => {
            console.error("Error creating element:", error);
        },
    });

    const batchUpdateElement = async (
        elementId: string | number,
        styles: any,
    ) => {
        return updateElementMutation.mutateAsync({ elementId, styles });
    };

    const updateElementPosition = async (
        elementId: string | number,
        position: { x: number; y: number },
    ) => {
        const element = findElementById(data?.elements || [], elementId);
        if (!element) return;

        const updatedStyles = {
            ...element.styles,
            left: `${position.x}px`,
            top: `${position.y}px`,
        };

        return updateElementMutation.mutateAsync({
            elementId,
            styles: updatedStyles,
        });
    };

    const findElementById = (elements: any[], id: string | number): any => {
        for (const element of elements) {
            if (element.id === id) return element;
            if (element.children?.length > 0) {
                const found = findElementById(element.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const getRandomColor = (): string => {
        const colors = [
            "#FF6633",
            "#FFB399",
            "#FF33FF",
            "#FFFF99",
            "#00B3E6",
            "#E6B333",
            "#3366E6",
            "#999966",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const createDefaultElement = (
        type: CanvasElement["type"],
        elementWidth: number,
        elementHeight: number,
        borderStyle: string,
        elementBoderWidth: number,
        elementRadius: number,
        flexDirection: string,
        alignItems: string,
        justifyContent: string,
        gap: number,
        elementsCount: number,
    ) => {
        return {
            type: "div",
            parentId: null,
            styles: {
                position: "absolute",
                left: "100px",
                top: "100px",
                width: `${elementWidth}px`,
                height: `${elementHeight}px`,
                backgroundColor: getRandomColor(),
                borderStyle: borderStyle,
                borderWidth: `${elementBoderWidth}px`,
                borderColor: "#000",
                borderRadius: `${elementRadius}px`,
                display: "flex",
                flexDirection: flexDirection,
                alignItems: alignItems,
                justifyContent: justifyContent,
                gap: `${gap}px`,
                cursor: "move",
                boxSizing: "border-box",
            },
            content: type === "text" ? "Text element" : "",
            attributes: {},
            order: elementsCount,
            name: `${type}_${Date.now()}`,
        };
    };

    return {
        // Data
        elements: data?.elements || [],
        isLoading,
        isError,

        // Mutations
        updateElementMutation,
        deleteElementMutation,
        createElementMutation,

        // Helper functions
        findElementById,
        batchUpdateElement,
        updateElementPosition,
        createDefaultElement,

        // Refetch
        refetch,
    };
};
