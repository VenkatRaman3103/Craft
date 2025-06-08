import { useState, useRef, useCallback } from "react";

interface DragState {
    isDragging: boolean;
    dragOffset: { x: number; y: number };
    dragStartPos: { x: number; y: number };
    selectedId: string | number | null;
}

interface UseDragAndDropProps {
    zoomLevel: number;
    canvasRef: React.RefObject<HTMLDivElement>;
    onDragEnd: (
        elementId: string | number,
        newPosition: { x: number; y: number },
    ) => void;
    findElementById: (elements: any[], id: string | number) => any;
    elements: any[];
}

export const useDragAndDrop = ({
    zoomLevel,
    canvasRef,
    onDragEnd,
    findElementById,
    elements,
}: UseDragAndDropProps) => {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        dragStartPos: { x: 0, y: 0 },
        selectedId: null,
    });

    const dragElementRef = useRef<HTMLDivElement | null>(null);
    const animationFrameRef = useRef<number>();

    const handleMouseDown = useCallback(
        (
            e: React.MouseEvent,
            elementId: string | number,
            onSelect: (id: string | number) => void,
        ) => {
            e.preventDefault();
            e.stopPropagation();

            onSelect(elementId);

            const canvasRect = canvasRef.current?.getBoundingClientRect();
            if (!canvasRect) return;

            const mouseX = (e.clientX - canvasRect.left) / zoomLevel;
            const mouseY = (e.clientY - canvasRect.top) / zoomLevel;

            const element = findElementById(elements, elementId);
            if (!element) return;

            const currentLeft = parseFloat(
                element.styles?.left?.replace("px", "") || "0",
            );
            const currentTop = parseFloat(
                element.styles?.top?.replace("px", "") || "0",
            );

            setDragState({
                isDragging: true,
                dragOffset: {
                    x: mouseX - currentLeft,
                    y: mouseY - currentTop,
                },
                dragStartPos: { x: currentLeft, y: currentTop },
                selectedId: elementId,
            });

            // ghost element
            const targetElement = e.currentTarget as HTMLDivElement;
            if (targetElement) {
                dragElementRef.current = targetElement;
                targetElement.style.pointerEvents = "none";
            }
        },
        [zoomLevel, canvasRef, findElementById, elements],
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!dragState.isDragging || !dragState.selectedId) return;

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                const canvasRect = canvasRef.current?.getBoundingClientRect();
                if (!canvasRect) return;

                const mouseX = (e.clientX - canvasRect.left) / zoomLevel;
                const mouseY = (e.clientY - canvasRect.top) / zoomLevel;

                const newLeft = Math.max(0, mouseX - dragState.dragOffset.x);
                const newTop = Math.max(0, mouseY - dragState.dragOffset.y);

                if (dragElementRef.current) {
                    dragElementRef.current.style.left = `${newLeft}px`;
                    dragElementRef.current.style.top = `${newTop}px`;
                    dragElementRef.current.style.zIndex = "9999";
                }
            });
        },
        [dragState, zoomLevel, canvasRef],
    );

    const handleMouseUp = useCallback(() => {
        if (!dragState.isDragging || !dragState.selectedId) return;

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (dragElementRef.current) {
            dragElementRef.current.style.pointerEvents = "auto";
            dragElementRef.current.style.zIndex = "";
        }

        const finalLeft = dragElementRef.current
            ? parseFloat(dragElementRef.current.style.left)
            : dragState.dragStartPos.x;
        const finalTop = dragElementRef.current
            ? parseFloat(dragElementRef.current.style.top)
            : dragState.dragStartPos.y;

        const hasPositionChanged =
            Math.abs(finalLeft - dragState.dragStartPos.x) > 1 ||
            Math.abs(finalTop - dragState.dragStartPos.y) > 1;

        if (hasPositionChanged) {
            onDragEnd(dragState.selectedId, { x: finalLeft, y: finalTop });
        }

        setDragState({
            isDragging: false,
            dragOffset: { x: 0, y: 0 },
            dragStartPos: { x: 0, y: 0 },
            selectedId: null,
        });

        dragElementRef.current = null;
    }, [dragState, onDragEnd]);

    return {
        isDragging: dragState.isDragging,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
};
