import { CollectionIntro } from "@/Components/CollectionIntro";
import { backendUrl } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./index.scss";
import { pageType } from "@/Types/blocks";

export const Collection = () => {
    const { collection_id } = useParams();
    const [pagesList, setPagesList] = useState<any>();

    const options = ["Pages", "Components", "Fields"];
    const [selectedOption, setSelectedOption] = useState(options[0]);

    useEffect(() => {
        async function getPages() {
            const response = await axios.get(
                `${backendUrl}/collection/${collection_id}`,
            );

            setPagesList(response.data);
        }
        getPages();
    }, [collection_id]);

    console.log(pagesList, "pagesList");

    return (
        <div className="collection-pages-container">
            <div className="collection-pages-wrapper">
                {pagesList && (
                    <CollectionIntro
                        collection={pagesList[0]?.collections}
                        collection_id={pagesList[0]?.collections.collection_id}
                        showNavBtn={false}
                    />
                )}

                <div className="view-options-container">
                    {/* <div className="view-options-wrapper"> */}
                    {options.map((item, ind) => (
                        <div
                            key={ind}
                            className={`options ${selectedOption == item ? "active" : ""}`}
                            onClick={() => setSelectedOption(item)}
                        >
                            {item}
                        </div>
                    ))}
                    {/* </div> */}
                </div>
                {/* TODO: filters */}
                {/* TODO: pages */}
                {/* TODO: components */}
                {/* TODO: fields */}
                {selectedOption == "Pages" && (
                    <div className="pages-list-container">
                        <div className="pages-list-wrapper">
                            {pagesList?.map((item: any, ind: number) => (
                                <PagePreview key={ind} page={item.pages} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const PagePreview = ({ page }: { page: pageType }) => {
    const navigate = useNavigate();

    function handleOpenPage(page_id: string) {
        navigate(`/pages/${page_id}`);
    }

    return (
        <div className="page-container">
            <div className="page-wrapper">
                <div className="page-image-wrapper">
                    <div className="page-image"></div>
                </div>
                <div className="collection-content-container">
                    <div className="collection-content-wrapper">
                        <div className="heading">{page.title}</div>
                        <button
                            className="go-to-page-btn"
                            onClick={() => handleOpenPage(page.page_id)}
                        >
                            Open Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
