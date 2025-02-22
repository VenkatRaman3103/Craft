import axios from "axios";
import { backendUrl } from "../../config";
import { useEffect, useState } from "react";
import "./indes.scss";

export const Folder = () => {
    const [endpointValue, setEndpointValue] = useState("");
    const CHARACTER_LIMIT = 20;

    useEffect(() => {
        async function fetchUser() {
            const response = await axios.get(`${backendUrl}/users`);
            console.log(response.data);
        }
        fetchUser();
    }, []);

    const handleEndpointChange = (e) => {
        const newValue = e.target.value.toLowerCase().replace(/\s+/g, "-");
        if (newValue.length <= CHARACTER_LIMIT) {
            setEndpointValue(
                newValue.startsWith("/") ? newValue : "/" + newValue,
            );
        } else {
            console.log(
                `Character limit exceeded. Maximum ${CHARACTER_LIMIT} characters allowed.`,
            );
        }
    };
    const formattedDate = new Date().toLocaleString("en-US", {
        // weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        // hour: "2-digit",
        // minute: "2-digit",
        // second: "2-digit",
        hour12: true,
    });

    return (
        <div className="folder-container">
            <div className="folder-wrapper">
                <div className="folder-info-container">
                    <div className="name-container">
                        <input
                            type="text"
                            placeholder="Folder name"
                            className="folder-name"
                        />
                        <input
                            type="text"
                            className="endpoint-name"
                            value={endpointValue}
                            onChange={handleEndpointChange}
                            maxLength={CHARACTER_LIMIT}
                            placeholder="/slug"
                            style={{
                                width: `calc(${Math.max(50, endpointValue.length * 8)}px + 8px)`,
                            }}
                        />
                    </div>
                    {/* <div className="details"> */}
                    {/*     <div>Last edit: {formattedDate}</div> */}
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
};
