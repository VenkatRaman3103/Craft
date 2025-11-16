import { useRef, useState } from "react";

export const ResizableBox = () => {
    const [size, setSize] = useState({ width: "auto", height: "auto" });
    const boxRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);
    const resizeDirection = useRef<string | null>(null);

    function handleMouseDown(e: React.MouseEvent, direction: string) {
        e.preventDefault();
        e.stopPropagation();
        isResizing.current = true;
        resizeDirection.current = direction;

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = boxRef.current!.offsetWidth;
        const startHeight = boxRef.current!.offsetHeight;

        function handleMouseMove(e: MouseEvent) {
            if (!isResizing.current || !resizeDirection.current) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;

            if (resizeDirection.current.includes("right"))
                newWidth = startWidth + dx;
            if (resizeDirection.current.includes("left")) {
                newWidth = startWidth - dx;
            }
            if (resizeDirection.current.includes("bottom"))
                newHeight = startHeight + dy;
            if (resizeDirection.current.includes("top")) {
                newHeight = startHeight - dy;
            }

            newWidth = Math.max(newWidth, 50);
            newHeight = Math.max(newHeight, 50);

            setSize({ width: newWidth, height: newHeight });
        }

        function handleMouseUp() {
            isResizing.current = false;
            resizeDirection.current = null;
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }

    return (
        <div
            ref={boxRef}
            className="resizable-box"
            style={{
                width: size.width,
                height: size.height,
            }}
        >
            <div className="content">Resizable Box</div>

            {/* Edges */}
            <div
                className="resizer top"
                onMouseDown={(e) => handleMouseDown(e, "top")}
            ></div>
            <div
                className="resizer right"
                onMouseDown={(e) => handleMouseDown(e, "right")}
            ></div>
            <div
                className="resizer bottom"
                onMouseDown={(e) => handleMouseDown(e, "bottom")}
            ></div>
            <div
                className="resizer left"
                onMouseDown={(e) => handleMouseDown(e, "left")}
            ></div>

            {/* Corners */}
            <div
                className="resizer top-left"
                onMouseDown={(e) => handleMouseDown(e, "top left")}
            ></div>
            <div
                className="resizer top-right"
                onMouseDown={(e) => handleMouseDown(e, "top right")}
            ></div>
            <div
                className="resizer bottom-left"
                onMouseDown={(e) => handleMouseDown(e, "bottom left")}
            ></div>
            <div
                className="resizer bottom-right"
                onMouseDown={(e) => handleMouseDown(e, "bottom right")}
            ></div>
        </div>
    );
};
