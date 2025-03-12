import React, { useEffect, useState } from "react";
import "./index.scss";

export const UrlField = ({ data }) => {
    return (
        <div className="url-input-field-container">
            <div className="url-type-container">
                <select name="url-type">
                    <option value="https://">{data.url_type}</option>
                </select>
            </div>
            <input className="url-input-field" type="url" value={data.value} />
        </div>
    );
};
