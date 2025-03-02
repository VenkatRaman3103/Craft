import { CollectionIntro } from "@/Components/CollectionIntro";
import { backendUrl, baseUrl } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./index.scss";
import { Explorer } from "@/Components/Explorer";

export const Collection = () => {
    const { collection_id } = useParams();
    const [pagesList, setPagesList] = useState();

    const navigate = useNavigate();

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

    function handleOpenPage(page_id: string) {
        navigate(`/pages/${page_id}`);
    }

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
                            {pagesList?.map((item, ind) => (
                                <div key={ind} className="page-container">
                                    <div className="page-wrapper">
                                        <div className="page-image-wrapper">
                                            <div className="page-image"></div>
                                        </div>
                                        <div className="collection-content-container">
                                            <div className="collection-content-wrapper">
                                                <div className="heading">
                                                    {item.pages.title}
                                                </div>
                                                <button
                                                    className="go-to-page-btn"
                                                    onClick={() =>
                                                        handleOpenPage(
                                                            item.pages.page_id,
                                                        )
                                                    }
                                                >
                                                    Open Page
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
