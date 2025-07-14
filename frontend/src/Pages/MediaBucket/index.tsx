// # media-buckets , # uploads

import { getAllMediaBuckets } from "@/api/mediaBuckets/getAllMediaBuckets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./index.scss";
import { EllipsisVertical, Folder, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { deleteMediaBucketById } from "@/api/mediaBuckets/deleteMediaBucketById";
import { createMediaBucket } from "@/api/mediaBuckets/createMediaBucket";
import { updateNameOfBucket } from "@/api/mediaBuckets/updateNameOfBucket";

export const MediaBucket = () => {
    const [activeBucket, setActiveBucket] = useState<null | string>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [type, setType] = useState("create");
    const [newBucketName, setNewBucketName] = useState("");

    const { data } = useQuery({
        queryKey: ["media-buckets"],
        queryFn: getAllMediaBuckets,
    });

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (name) => createMediaBucket(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["media-buckets"] });
            setShowPrompt(false);
            setNewBucketName("");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteMediaBucketById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["media-buckets"] });
        },
    });

    const updateNameMutation = useMutation({
        mutationFn: (body) => updateNameOfBucket(body.id, body.name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["media-buckets"] });
            setShowPrompt(false);
            setNewBucketName("");
        },
    });

    function handleCreateBucket() {
        createMutation.mutate(newBucketName);
    }

    function handleDeleteBucket() {
        deleteMutation.mutate(activeBucket);
    }

    function handleRenameBucket() {
        const body = {
            id: activeBucket,
            name: newBucketName,
        };
        updateNameMutation.mutate(body);
    }

    return (
        <div className="media-buckets-container">
            {data?.map((item, ind) => (
                <Bucket
                    key={ind}
                    data={item}
                    setActiveBucket={setActiveBucket}
                    activeBucket={activeBucket}
                    handleDeleteBucket={handleDeleteBucket}
                    setType={setType}
                    setShowPrompt={setShowPrompt}
                    setNewBucketName={setNewBucketName}
                />
            ))}

            <button
                className="create-prompt-btn"
                onClick={() => {
                    setType("create");
                    setShowPrompt(!showPrompt);
                    setNewBucketName(""); // reset input
                }}
            >
                add bucket
            </button>

            {showPrompt && (
                <BucketPrompt
                    newBucketName={newBucketName}
                    setNewBucketName={setNewBucketName}
                    handleCreateBucket={handleCreateBucket}
                    setShowPrompt={setShowPrompt}
                    handleRenameBucket={handleRenameBucket}
                    type={type}
                />
            )}
        </div>
    );
};

export const BucketPrompt = ({
    newBucketName,
    setNewBucketName,
    handleCreateBucket,
    handleRenameBucket,
    setShowPrompt,
    type,
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
                {type === "create" ? (
                    <button
                        className="create-prompt-button create"
                        onClick={handleCreateBucket}
                    >
                        create
                    </button>
                ) : (
                    <button
                        className="create-prompt-button create"
                        onClick={handleRenameBucket}
                    >
                        rename
                    </button>
                )}
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
    setType,
    setShowPrompt,
    setNewBucketName,
}) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutsideMenu(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setToggleMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutsideMenu);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideMenu);
        };
    }, []);

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
                            setType={setType}
                            setShowPrompt={setShowPrompt}
                            setNewBucketName={setNewBucketName}
                            currentName={data.name}
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
                        {Array.from({ length: 5 }).map((_, ind) => (
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

export const BucketMenu = ({
    menuRef,
    handleDeleteBucket,
    setType,
    setShowPrompt,
    setNewBucketName,
    currentName,
}) => {
    return (
        <div className="bucket-menu-container" ref={menuRef}>
            <div className="bucket-menu-items-container">
                <div
                    className="bucket-menu-edit-item-container bucket-menu-item"
                    onClick={() => {
                        setType("rename");
                        setNewBucketName(currentName);
                        setShowPrompt(true);
                    }}
                >
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
