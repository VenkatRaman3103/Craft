import { getAllMediaBuckets } from "@/api/mediaBuckets/getAllMediaBuckets";
import { useQuery } from "@tanstack/react-query";
import "./index.scss";
import { EllipsisVertical, Folder } from "lucide-react";
import { useState } from "react";

export const MediaBucket = () => {
    // local state
    const [activeBucket, setActiveBucket] = useState<null | string>(null);

    const { data } = useQuery({
        queryKey: ["media-buckets"],
        queryFn: getAllMediaBuckets,
    });

    return (
        <div className="media-buckets-container">
            {data?.map((item, ind) => (
                <Bucket
                    key={ind}
                    data={item}
                    setActiveBucket={setActiveBucket}
                    activeBucket={activeBucket}
                />
            ))}
        </div>
    );
};

export const Bucket = ({ data, setActiveBucket, activeBucket }) => {
    const [toggleMenu, setToggleMenu] = useState(false);

    /// handlers

    // menu
    function handleToggleMenu() {
        setActiveBucket(data.id);
        setToggleMenu(!toggleMenu);
    }

    return (
        <div>
            <div className="bucket-container">
                <div className="bucket-content">
                    <div className="bucket-menu">
                        <EllipsisVertical
                            size={18}
                            onClick={handleToggleMenu}
                        />
                    </div>
                    {toggleMenu && activeBucket === data.id && <BucketMenu />}
                    <div className="bucket-heading-marking">
                        <Folder size={13} />
                        Folder
                    </div>
                    <div className="bucket-heading">{data.name}</div>
                </div>
                <div className="bucket-stats-container">
                    <div className="bucket-stats-wrapper">
                        {Array.from({ length: 5 }).map((item, ind) => (
                            <div className="bucket-stat" key={ind}>
                                {ind + 1}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BucketMenu = () => {
    return (
        <div className="bucket-menu-container">
            <div>menu</div>
        </div>
    );
};
