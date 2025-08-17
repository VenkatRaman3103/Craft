import { render, screen } from "@testing-library/react";
import { Greet } from "./Greet";
import { describe, expect, it } from "vitest";

describe("Greet", () => {
    it("renders greeting message", () => {
        render(<Greet name="John" />);
        const text = screen.getByText(/Hello John/i);
        expect(text).toBeInTheDocument();
    });
});
