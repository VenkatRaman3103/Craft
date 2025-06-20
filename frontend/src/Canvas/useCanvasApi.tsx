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
            ...updateData
        }: {
            elementId: string | number;
            styles?: any;
            content?: string;
            [key: string]: any;
        }) => {
            const response = await axios.patch(
                `${backendUrl}/canvas/pages/elements/${elementId}`,
                updateData,
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
        updateData: any,
    ) => {
        return updateElementMutation.mutateAsync({ elementId, ...updateData });
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
        zIndex: number,
        elementOverFlow: string,
        elementMinHeight: number,
        elementMinWidth: number,
        elementMaxHeight: number | string,
        elementMaxWidth: number | string,
        textWrap: string,
        alignType: string,
        fontFamily: string,
        fontWeight: string,
        fontSize: number,
        fontStyle: string,
        textDecoration: string,
        textAlign: string,
        lineHeight: number,
        letterSpacing: number,
        backgroundColor: string,
        borderColor: string,
        textColor: string,
        useGradient: boolean,
        gradientBackground: string,
    ) => {
        // Define element categories
        const textElements = [
            "p",
            "h1",
            "h2",
            "h3",
            "span",
            "strong",
            "em",
            "blockquote",
            "code",
        ];
        const listElements = ["ul", "ol"];
        const inputElements = ["text", "textarea", "checkbox", "radio"];
        const interactiveElements = ["button"];

        const isTextElement = textElements.includes(type);
        const isListElement = listElements.includes(type);
        const isInputElement = inputElements.includes(type);
        const isInteractiveElement = interactiveElements.includes(type);

        const baseStyles = {
            position: "absolute",
            left: "50px",
            top: "50px",
            zIndex: zIndex,
            borderStyle: borderStyle,
            borderWidth: `${elementBoderWidth}px`,
            borderColor: borderColor,
            borderRadius: `${elementRadius}px`,
            display: alignType,
            flexDirection: flexDirection,
            alignItems: alignItems,
            justifyContent: justifyContent,
            gap: `${gap}px`,
            overflow: elementOverFlow,
            whiteSpace: textWrap,
            fontFamily,
            fontWeight,
            fontSize: `${fontSize}px`,
            fontStyle,
            textDecoration,
            textAlign,
            lineHeight,
            letterSpacing: `${letterSpacing}px`,
            color: textColor,
        };

        const getDefaultContent = (elementType: string): string => {
            switch (elementType) {
                case "ul":
                case "ol":
                    return "[]";
                case "p":
                    return "Enter paragraph";
                case "h1":
                    return "Heading 1";
                case "h2":
                    return "Heading 2";
                case "h3":
                    return "Heading 3";
                case "span":
                    return "Span text";
                case "strong":
                    return "Strong text";
                case "em":
                    return "Emphasized text";
                case "blockquote":
                    return "Quote text";
                case "code":
                    return "Code snippet";
                case "button":
                    return "Button";
                case "text":
                    return "Enter text...";
                case "textarea":
                    return "Enter textarea...";
                case "checkbox":
                case "radio":
                    return "";
                default:
                    return "";
            }
        };

        let elementSpecificStyles = {};

        if (isListElement) {
            elementSpecificStyles = {
                width: "200px",
                height: "auto",
                minWidth: "100px",
                minHeight: "auto",
                maxWidth:
                    elementMaxWidth === "none"
                        ? "none"
                        : `${elementMaxWidth}px`,
                maxHeight:
                    elementMaxHeight === "none"
                        ? "none"
                        : `${elementMaxHeight}px`,
                backgroundColor: useGradient ? undefined : "transparent",
                background: useGradient ? gradientBackground : undefined,
            };
        } else if (isTextElement) {
            elementSpecificStyles = {
                width: textWrap === "nowrap" ? "auto" : `${elementWidth}px`,
                height: textWrap === "nowrap" ? "auto" : `${elementHeight}px`,
                minWidth:
                    textWrap === "nowrap" ? "auto" : `${elementMinWidth}px`,
                minHeight:
                    textWrap === "nowrap" ? "auto" : `${elementMinHeight}px`,
                maxWidth:
                    textWrap === "nowrap"
                        ? "none"
                        : elementMaxWidth === "none"
                          ? "none"
                          : `${elementMaxWidth}px`,
                maxHeight:
                    textWrap === "nowrap"
                        ? "none"
                        : elementMaxHeight === "none"
                          ? "none"
                          : `${elementMaxHeight}px`,
                backgroundColor: useGradient ? undefined : "transparent",
                background: useGradient ? gradientBackground : undefined,
            };
        } else if (isInputElement) {
            elementSpecificStyles = {
                width: type === "textarea" ? `${elementWidth}px` : "auto",
                height: type === "textarea" ? `${elementHeight}px` : "auto",
                minWidth: type === "textarea" ? `${elementMinWidth}px` : "auto",
                minHeight:
                    type === "textarea" ? `${elementMinHeight}px` : "auto",
                maxWidth:
                    elementMaxWidth === "none"
                        ? "none"
                        : `${elementMaxWidth}px`,
                maxHeight:
                    elementMaxHeight === "none"
                        ? "none"
                        : `${elementMaxHeight}px`,
                backgroundColor: useGradient ? undefined : backgroundColor,
                background: useGradient ? gradientBackground : undefined,
            };
        } else {
            elementSpecificStyles = {
                width: `${elementWidth}px`,
                height: `${elementHeight}px`,
                minWidth: `${elementMinWidth}px`,
                minHeight: `${elementMinHeight}px`,
                maxWidth:
                    elementMaxWidth === "none"
                        ? "none"
                        : `${elementMaxWidth}px`,
                maxHeight:
                    elementMaxHeight === "none"
                        ? "none"
                        : `${elementMaxHeight}px`,
                backgroundColor: useGradient ? undefined : backgroundColor,
                background: useGradient ? gradientBackground : undefined,
            };
        }

        return {
            type,
            styles: {
                ...baseStyles,
                ...elementSpecificStyles,
            },
            content: getDefaultContent(type),
            name: `${type}_${Date.now()}`,
            attributes: {},
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
