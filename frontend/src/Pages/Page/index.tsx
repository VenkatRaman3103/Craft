import { Blocks } from "@/Components/Blocks";
import { PageIntro } from "@/Components/PageIntro";
import { backendUrl } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Page = () => {
    const { page_id } = useParams();
    const [pageData, setPageData] = useState();

    useEffect(() => {
        async function getPageData() {
            const response = await axios.get(`${backendUrl}/pages/${page_id}`);
            setPageData(response.data);
        }
        getPageData();
    }, [page_id]);

    console.log(pageData, "pageData");

    return (
        <div>
            <PageIntro data={pageData} />
            {pageData && (
                <div>
                    <Blocks blocks={pageData.blocks} />
                </div>
            )}
        </div>
    );
};
