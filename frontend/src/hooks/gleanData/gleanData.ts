import { backendUrl } from "@/config";
import axios from "axios";

const baseUrl = "https://api.staging.insightiq.ai/v1/work-platforms";

const headers = {
    Accept: "application/json",
    Authorization:
        "Basic NWU2ZDkwZjYtYmMxZS00OTc5LWJlYmEtY2YzOTA5ZjgxZGMxOjg1ZTZiY2UzLTA1MmMtNGJmYy1hNDJhLTY5NmFhM2ZhMjk0OQ==",
};

export const gleanData = async () => {
    // const response = await axios.get(
    //     "https://api.staging.insightiq.ai/v1/work-platforms",
    //     {
    //         headers,
    //     },
    // );

    // const apitube_response = await axios.get(
    //     "https://api.apitube.io/v1/news/everything?per_page=10&sort.order=desc&title=Tesla&api_key=api_live_OjeHlbtTqz6wIyLmJppEHQSbgj49er5AlFaNWdsNJbpT7Ub",
    // );

    const apitube_response = await axios.get(`${backendUrl}/news`);

    // console.log(response.data, "response data");
    console.log(apitube_response.data, "apitube_response");

    const create_social_response = await axios.post(
        "https://api.staging.insightiq.ai/v1/social/creators/contents/search",
        {
            work_platform_id: "de55aeec-0dc8-4119-bf90-16b3d1f0c987",
            keyword: "tesla",
        },
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                    "Basic NWU2ZDkwZjYtYmMxZS00OTc5LWJlYmEtY2YzOTA5ZjgxZGMxOjg1ZTZiY2UzLTA1MmMtNGJmYy1hNDJhLTY5NmFhM2ZhMjk0OQ==",
            },
        },
    );
    console.log("Crating Response:", create_social_response.data);

    const status_response = await axios.get(
        "https://api.staging.insightiq.ai/v1/social/creators/contents/search/d841ece5-134b-4d76-be3d-1c500d3a6c25",
        {
            headers: {
                Accept: "application/json",
                Authorization:
                    "Basic NWU2ZDkwZjYtYmMxZS00OTc5LWJlYmEtY2YzOTA5ZjgxZGMxOjg1ZTZiY2UzLTA1MmMtNGJmYy1hNDJhLTY5NmFhM2ZhMjk0OQ==",
            },
        },
    );
    console.log("status_response Response", status_response.data);

    const id = await status_response.data.id;
    console.log("status_response Response id:", id);

    const getSocial_insight = await axios.get(
        `https://api.staging.insightiq.ai/v1/social/creators/contents/search/${id}/fetch`,
        {
            headers: {
                Accept: "application/json",
                Authorization:
                    "Basic NWU2ZDkwZjYtYmMxZS00OTc5LWJlYmEtY2YzOTA5ZjgxZGMxOjg1ZTZiY2UzLTA1MmMtNGJmYy1hNDJhLTY5NmFhM2ZhMjk0OQ==",
            },
        },
    );

    console.log("getSocial_insight Response:", getSocial_insight.data);

    return apitube_response.data;
};
