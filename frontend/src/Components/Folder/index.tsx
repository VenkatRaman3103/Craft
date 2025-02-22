import axios from "axios";
import { backendUrl } from "../../config";
import { useEffect } from "react";

export const Folder = () => {
    useEffect(() => {
        async function fetchUser() {
            const response = await axios.get(`${backendUrl}/users`);

            console.log(response.data);
        }
        fetchUser();
    }, []);

    return <div>Folder</div>;
};
