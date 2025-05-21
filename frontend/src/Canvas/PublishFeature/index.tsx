import React, { useState } from "react";

export const PublishFeature = ({
    elements,
    elementWidth,
    elementHeight,
    elementRadius,
}) => {
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
        );

        // Store it in localStorage (for persistence between refreshes)
        localStorage.setItem("publishedSite", htmlContent);

        // Create a unique URL for this published site
        const publishTimestamp = Date.now();
        const url = `/preview/${publishTimestamp}`;
        localStorage.setItem("publishedUrl", url);

        // Simulate server processing
        setTimeout(() => {
            setPublished(true);
            setIsLoading(false);
        }, 800);
    };

    // Function to generate HTML from canvas elements
    const generateHtml = (elements, width, height, radius) => {
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
              .element-content.rectangle { width: 100%; height: 100%; }
              .element-content.circle { width: 100%; height: 100%; border-radius: 50%; }
            </style>
          </head>
          <body>
        <div class="canvas">
    `;

        // Generate elements HTML
        let elementsHtml = "";
        elements.forEach((element) => {
            const elementStyle = `
        left: ${element.x}px;
        top: ${element.y}px;
        width: ${width}px;
        height: ${height}px;
        background-color: ${element.color};
        position: absolute;
        border-radius: ${radius}px
      `;

            let content = "";
            if (element.type === "text") {
                content = element.text;
            } else if (element.type === "div") {
                content = '<div class="element-content rectangle"></div>';
            } else {
                content = '<div class="element-content circle"></div>';
            }

            elementsHtml += `
        <div class="canvas-element" style="${elementStyle}">
          ${content}
        </div>
      `;
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
        // For localhost, we'll use a simple approach - open a new window with the HTML content
        const htmlContent = localStorage.getItem("publishedSite");
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
