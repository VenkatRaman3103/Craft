import { CollectionPreview } from "@/components/CollectionPreview";
import { PagePreview } from "@/components/PagesPreview";
import "./index.scss";

type Props = {
    elements: any;
    activeElement: any;
};

export const ElementsContent = ({ elements, activeElement }: Props) => {
    const renderElementContent = (kind: string) => {
        const tabContent = elements[activeElement];

        switch (kind) {
            case "collections":
                return (
                    <div className="collection-grid">
                        {tabContent.collections.map((collection: any) => (
                            <CollectionPreview {...collection} />
                        ))}
                    </div>
                );
            case "pages":
                return (
                    <div className="pages-list">
                        {tabContent.pages.map((page: any) => (
                            <PagePreview {...page} />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="elements-contenr">
            {renderElementContent(elements[activeElement]?.kind)}
        </div>
    );
};
