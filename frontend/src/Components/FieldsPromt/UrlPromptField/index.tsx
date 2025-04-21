import React, { useEffect, useState } from "react";
import "./index.scss";

export const UrlPromt = ({
    url,
    setUrl,
}: {
    url: { url_type: string; value: string };
    setUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const [urlString, setUrlString] = useState(url.value);
    const [urlType, setUrlType] = useState(url.url_type);

    useEffect(() => {
        setUrl({
            url_type: urlType,
            value: urlString,
        });
    }, [urlString, urlType, setUrl]);

    function handleUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setUrlString(event.target.value);
    }

    console.log(url, urlType, "urlPrompt");

    return (
        <div className="url-input-field-container">
            <div className="url-type-container">
                <select
                    name="url-type"
                    value={urlType}
                    onChange={(e) => setUrlType(e.target.value)}
                >
                    <option value="http">http</option>
                    <option value="https">https</option>
                </select>
            </div>
            <input
                className="url-input-field"
                type="url"
                value={url.value}
                onChange={handleUrlChange}
            />
        </div>
    );
};
