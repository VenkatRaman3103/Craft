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

    const handlePublish = () => {
        setIsLoading(true);

        const htmlContent = generateHtml(
            elements,
            elementWidth,
            elementHeight,
            elementRadius,
            elementBoderWidth,
        );

        window.publishedSite = htmlContent;

        const publishTimestamp = Date.now();
        const url = `/preview/${publishTimestamp}`;
        window.publishedUrl = url;

        setTimeout(() => {
            setPublished(true);
            setIsLoading(false);
        }, 800);
    };

    const generateHtml = (elements, width, height, radius, borderWidth) => {
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
              .group-container { 
                position: absolute; 
                display: flex;
              }
              .group-child {
                position: relative;
                flex-shrink: 0;
              }
            </style>
          </head>
          <body>
        <div class="canvas">
    `;

        const getFlexDirection = (element) => {
            const baseDirection = element.flexDirection || "row";
            const isReversed = element.isReversed || false;

            if (isReversed) {
                return baseDirection === "row"
                    ? "row-reverse"
                    : "column-reverse";
            }
            return baseDirection;
        };

        const renderElement = (element, offsetX = 0, offsetY = 0) => {
            if (element.isGroup && element.children) {
                const groupStyle = `
                    position: absolute;
                    left: ${element.x + offsetX}px;
                    top: ${element.y + offsetY}px;
                    width: ${element.width}px;
                    height: ${element.height}px;
                    display: flex;
                    flex-direction: ${getFlexDirection(element)};
                    align-items: ${element.alignItems || "flex-start"};
                    justify-content: ${element.justifyContent || "flex-start"};
                    gap: ${element.gap || 0}px;
                `;

                let groupHtml = `<div class="group-container" style="${groupStyle}">`;

                element.children.forEach((child) => {
                    groupHtml += renderGroupChild(child);
                });

                groupHtml += "</div>";
                return groupHtml;
            } else {
                return renderIndividualElement(
                    element,
                    offsetX,
                    offsetY,
                    width,
                    height,
                    radius,
                    borderWidth,
                );
            }
        };

        const renderGroupChild = (child) => {
            if (child.isGroup && child.children) {
                const nestedGroupStyle = `
                    position: relative;
                    width: ${child.width}px;
                    height: ${child.height}px;
                    display: flex;
                    flex-direction: ${getFlexDirection(child)};
                    align-items: ${child.alignItems || "flex-start"};
                    justify-content: ${child.justifyContent || "flex-start"};
                    gap: ${child.gap || 0}px;
                    flex-shrink: 0;
                `;

                let nestedHtml = `<div class="group-child" style="${nestedGroupStyle}">`;
                child.children.forEach((nestedChild) => {
                    nestedHtml += renderGroupChild(nestedChild);
                });
                nestedHtml += "</div>";
                return nestedHtml;
            } else {
                const childStyle = `
                    position: relative;
                    width: ${child.width}px;
                    height: ${child.height}px;
                    background-color: ${child.color};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    ${
                        toggleAllSide_radius === "specific"
                            ? `
                        border-top-left-radius: ${topLeftRadius}px;
                        border-top-right-radius: ${topRightRadius}px;
                        border-bottom-left-radius: ${bottomLeftRadius}px;
                        border-bottom-right-radius: ${bottomRightRadius}px;
                        `
                            : `border-radius: ${child["border-radius"] || radius}px;`
                    }
                    border-style: ${child["border-style"] || elementBorderStyle};
                    ${
                        toggleAllSide_width === "specific"
                            ? `
                        border-top-width: ${topWidth}px;
                        border-bottom-width: ${bottomWidth}px;
                        border-left-width: ${leftWidth}px;
                        border-right-width: ${rightWidth}px;
                        `
                            : `border-width: ${elementBoderWidth}px;`
                    }
                `;

                let content = "";
                if (child.type === "text") {
                    content = child.text || "Text element";
                } else if (child.type === "div") {
                    content = "div";
                } else if (child.type === "circle") {
                    content = "circle";
                }

                return `<div class="group-child" style="${childStyle}">${content}</div>`;
            }
        };

        const renderIndividualElement = (
            element,
            offsetX,
            offsetY,
            width,
            height,
            radius,
            borderWidth,
        ) => {
            const elementStyle = `
                left: ${element.x + offsetX}px;
                top: ${element.y + offsetY}px;
                width: ${element.width || width}px;
                height: ${element.height || height}px;
                background-color: ${element.color};
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
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
                content = "div";
            } else if (element.type === "circle") {
                content = "circle";
            }

            return `
                <div class="canvas-element" style="${elementStyle}">
                    ${content}
                </div>
            `;
        };

        let elementsHtml = "";
        elements.forEach((element) => {
            elementsHtml += renderElement(element);
        });

        const htmlFooter = `
        </div>
      </body>
      </html>
    `;

        return htmlHeader + elementsHtml + htmlFooter;
    };

    const openPublishedSite = () => {
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
