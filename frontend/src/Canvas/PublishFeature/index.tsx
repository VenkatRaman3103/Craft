import { useState } from "react";

export const PublishFeature = ({
    elements,
    elementWidth,
    elementHeight,
    elementRadius,
    topRightRadius,
    topLeftRadius,
    bottomRightRadius,
    bottomLeftRadius,
    toggleAllSide_radius,
    elementBorderStyle,
    toggleAllSide_width,
    elementBoderWidth,
    leftWidth,
    rightWidth,
    topWidth,
    bottomWidth,
}: any) => {
    const [published, setPublished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle publish
    const handlePublish = () => {
        setIsLoading(true);

        // Generate HTML content from the canvas elements
        const htmlContent = generateHtml(
            elements,
            elementWidth,
            elementHeight,
            elementRadius,
            elementBoderWidth,
        );

        // Store it in memory (since localStorage is not supported in artifacts)
        // In a real application, you would send this to a server
        window.publishedSite = htmlContent;

        // Create a unique URL for this published site
        const publishTimestamp = Date.now();
        const url = `/preview/${publishTimestamp}`;
        window.publishedUrl = url;

        // Simulate server processing
        setTimeout(() => {
            setPublished(true);
            setIsLoading(false);
        }, 800);
    };

    // Function to generate HTML from canvas elements (with grouping support)
    const generateHtml = (elements, width, height, radius, borderWidth) => {
        // Base HTML template
        const htmlHeader = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Published Site</title>
            <style>
              body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
              .canvas { position: relative; width: 100%; height: 100vh; }
              .canvas-element { position: absolute; }
              .element-content.rectangle { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
              .element-content.circle { width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
              .group-container { position: absolute; }
            </style>
          </head>
          <body>
        <div class="canvas">
    `;

        // Function to render a single element or group recursively
        const renderElement = (element, offsetX = 0, offsetY = 0) => {
            if (element.isGroup && element.children) {
                // Handle grouped elements
                let groupHtml = `<div class="group-container" style="position: absolute; left: ${element.x + offsetX}px; top: ${element.y + offsetY}px; width: ${element.width}px; height: ${element.height}px;">`;

                // Render all children within this group
                element.children.forEach((child) => {
                    groupHtml += renderElement(child, 0, 0); // Children positions are relative to group
                });

                groupHtml += "</div>";
                return groupHtml;
            } else {
                // Handle individual elements
                const elementStyle = `
                    left: ${element.x + offsetX}px;
                    top: ${element.y + offsetY}px;
                    width: ${element.width || width}px;
                    height: ${element.height || height}px;
                    background-color: ${element.color};
                    position: absolute;
                    align-items: ${element.alignItems || "flex-start"}; 
                    justify-content: ${element.justifyContent || "flex-start"}; 
                    flex-direction: ${element.flexDirection || "row"}; 
                    border-style: ${element["border-style"] || elementBorderStyle};
                    ${
                        toggleAllSide_width === "specific"
                            ? `
                    border-top-width: ${topWidth}px;
                    border-bottom-width: ${bottomWidth}px;
                    border-left-width: ${leftWidth}px;
                    border-right-width: ${rightWidth}px;
                    `
                            : `border-width: ${borderWidth}px;`
                    }
                    ${
                        toggleAllSide_radius === "specific"
                            ? `
                    border-top-left-radius: ${topLeftRadius}px;
                    border-top-right-radius: ${topRightRadius}px;
                    border-bottom-left-radius: ${bottomLeftRadius}px;
                    border-bottom-right-radius: ${bottomRightRadius}px;
                    `
                            : `border-radius: ${element["border-radius"] || radius}px;`
                    }
                `;

                let content = "";
                if (element.type === "text") {
                    content = element.text || "Text element";
                } else if (element.type === "div") {
                    content =
                        '<div class="element-content rectangle">div</div>';
                } else if (element.type === "circle") {
                    content =
                        '<div class="element-content circle">circle</div>';
                }

                return `
                    <div class="canvas-element" style="${elementStyle}">
                        ${content}
                    </div>
                `;
            }
        };

        // Generate elements HTML
        let elementsHtml = "";
        elements.forEach((element) => {
            elementsHtml += renderElement(element);
        });

        // Complete HTML
        const htmlFooter = `
        </div>
      </body>
      </html>
    `;

        return htmlHeader + elementsHtml + htmlFooter;
    };

    // Open the published site in a new tab
    const openPublishedSite = () => {
        // Get the HTML content from memory
        const htmlContent = window.publishedSite;
        const newWindow = window.open("", "_blank");
        if (newWindow) {
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        }
    };

    if (!published) {
        return (
            <button
                className="publish-button"
                onClick={handlePublish}
                disabled={isLoading || elements.length === 0}
            >
                {isLoading ? "Publishing..." : "Publish"}
            </button>
        );
    } else {
        return (
            <div className="publish-actions">
                <button className="view-button" onClick={openPublishedSite}>
                    View
                </button>
                <button
                    className="republish-button"
                    onClick={() => setPublished(false)}
                >
                    Republish
                </button>
            </div>
        );
    }
};
