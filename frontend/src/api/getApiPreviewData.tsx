import axios from "axios";

export async function getApiPreviewData() {
    const response = await axios.get(
        `http://localhost:5000/services/api/page/0fe68c52-6c02-4f81-bdf9-0f8c4bec9081`,
    );
    console.log(response, "responseAPi");
    return response.data;
}
