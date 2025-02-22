import axios from "axios";
import { backendUrl } from "../../config";
import { useEffect } from "react";
import "./indes.scss";

export const Folder = () => {
    useEffect(() => {
        async function fetchUser() {
            const response = await axios.get(`${backendUrl}/users`);

            console.log(response.data);
        }
        fetchUser();
    }, []);

    return (
        <div className="folder-container">
            <div className="folder-wrapper">
                <div className="folder-info-container"></div>
            </div>
        </div>
    );
};
