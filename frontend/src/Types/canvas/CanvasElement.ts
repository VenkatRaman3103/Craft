import { elementType } from "./elementsType";

export type CanvasElement = {
    id: number;
    type: elementType;
    x: number;
    y: number;
    width: number;
    "border-radius": number;
    height: number;
    text: string;
    color: string;
    "border-style": string;
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    justifyContent?:
        | "flex-start"
        | "center"
        | "flex-end"
        | "space-between"
        | "space-around";
    flexDirection?: "row" | "column";
    isReversed?: boolean;
    gap?: number;
    children?: CanvasElement[];
    isGroup?: boolean;
    groupLevel?: number;
};
