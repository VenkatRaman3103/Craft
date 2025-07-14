// # media-buckets , # uploads

import { getAllMediaBuckets } from "@/api/mediaBuckets/getAllMediaBuckets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./index.scss";
import { EllipsisVertical, Folder, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { deleteMediaBucketById } from "@/api/mediaBuckets/deleteMediaBucketById";
import { createMediaBucket } from "@/api/mediaBuckets/createMediaBucket";

export const MediaBucket = () => {
    // local state
    const [activeBucket, setActiveBucket] = useState<null | string>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    const [newBucketName, setNewBucketName] = useState("");

    // query
    const { data } = useQuery({
        queryKey: ["media-buckets"],
        queryFn: getAllMediaBuckets,
    });

    const queryClient = useQueryClient();

    // MUTATIONS
    // create mutation
    const createMutation = useMutation({
        mutationFn: (name) => createMediaBucket(name),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["media-buckets"],
            });
            setShowPrompt(false);
            setNewBucketName("");
        },
    });

    // delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteMediaBucketById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["media-buckets"],
            });
        },
    });

    // update mutation

    /// HANDLERS
    // create new bucket
    function handleCreateBucket() {
        createMutation.mutate(newBucketName);
    }

    // delete bucket based on the id
    function handleDeleteBucket() {
        deleteMutation.mutate(activeBucket);
    }

    return (
        <div className="media-buckets-container">
            {data?.map((item, ind) => (
                <Bucket
                    key={ind}
                    data={item}
                    setActiveBucket={setActiveBucket}
                    activeBucket={activeBucket}
                    deleteMutation={deleteMutation}
                    handleDeleteBucket={handleDeleteBucket}
                />
            ))}
            <button
                className="create-prompt-btn"
                onClick={() => setShowPrompt(!showPrompt)}
            >
                add bucket
            </button>
            {showPrompt && (
                <BucketPrompt
                    newBucketName={newBucketName}
                    setNewBucketName={setNewBucketName}
                    handleCreateBucket={handleCreateBucket}
                    setShowPrompt={setShowPrompt}
                />
            )}
        </div>
    );
};

export const BucketPrompt = ({
    newBucketName,
    setNewBucketName,
    handleCreateBucket,
    setShowPrompt,
}) => {
    return (
        <div className="create-prompt-cotainer">
            <div className="create-prompt-name-wrapper">
                <div className="create-prompt-name-label">name</div>
                <input
                    onChange={(e) => setNewBucketName(e.target.value)}
                    value={newBucketName}
                    className="create-prompt-name-input"
                />
            </div>
            <div className="create-prompt-button-wrapper">
                <button
                    className="create-prompt-button create"
                    onClick={handleCreateBucket}
                >
                    create
                </button>
                <button
                    className="create-prompt-button cancel"
                    onClick={() => setShowPrompt(false)}
                >
                    cancel
                </button>
            </div>
        </div>
    );
};

export const Bucket = ({
    data,
    setActiveBucket,
    activeBucket,
    handleDeleteBucket,
}) => {
    const [toggleMenu, setToggleMenu] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutsideMenu(event) {
            if (menuRef.current && !menuRef?.current.contains(event?.target)) {
                setToggleMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutsideMenu);

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideMenu);
        };
    }, [menuRef]);

    /// HANDLERS
    // to toggle menu
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
                    {toggleMenu && activeBucket === data.id && (
                        <BucketMenu
                            menuRef={menuRef}
                            handleDeleteBucket={handleDeleteBucket}
                        />
                    )}
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

export const BucketMenu = ({ menuRef, handleDeleteBucket }) => {
    return (
        <div className="bucket-menu-container" ref={menuRef}>
            <div className="bucket-menu-items-container">
                <div className="bucket-menu-edit-item-container bucket-menu-item">
                    <div>rename</div>
                    <Pencil className="bucket-menu-edit-icon" size={18} />
                </div>
                <div
                    className="bucket-menu-delete-item-container bucket-menu-item"
                    onClick={handleDeleteBucket}
                >
                    <div>delete</div>
                    <Trash2 className="bucket-menu-delete-icon" size={18} />
                </div>
            </div>
        </div>
    );
};
