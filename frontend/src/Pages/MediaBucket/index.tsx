// # media-buckets , # uploads

import { getAllMediaBuckets } from "@/api/mediaBuckets/getAllMediaBuckets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./index.scss";
import { EllipsisVertical, Folder, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { deleteMediaBucketById } from "@/api/mediaBuckets/deleteMediaBucketById";
import { createMediaBucket } from "@/api/mediaBuckets/createMediaBucket";
import { updateNameOfBucket } from "@/api/mediaBuckets/updateNameOfBucket";
import { useParams } from "react-router";
import ImageUpload from "@/Components/ImageUpload";
import { ListOfMedias } from "@/Components/ListOfMedias";
import { getAllMedia } from "@/api/mediaBuckets/uploads/getAllMedia";
import { deleteMediaById } from "@/api/mediaBuckets/uploads/deleteMediaById";

export const MediaBucket = () => {
    const { bucket_id } = useParams();
    // local state
    const [activeBucket, setActiveBucket] = useState<null | string>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [type, setType] = useState("create");
    const [newBucketName, setNewBucketName] = useState("");
    const [showImageUpload, setShowImageUpload] = useState(false);

    /// query
    const queryClient = useQueryClient();

    // media buckets
    const { data } = useQuery({
        queryKey: ["media-buckets"],
        queryFn: async () => getAllMediaBuckets(bucket_id),
    });

    // medias
    const { data: mediaData } = useQuery({
        queryKey: ["medias"],
        queryFn: async () => getAllMedia(bucket_id),
    });

    // MUTATIONS for buckets
    // create mutation
    const createMutation = useMutation({
        mutationFn: (name) => createMediaBucket(name, bucket_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["media-buckets"] });
            setShowPrompt(false);
            setNewBucketName("");
        },
    });

    // delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteMediaBucketById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["media-buckets"] });
        },
    });

    // update mutation
    const updateNameMutation = useMutation({
        mutationFn: (body) => updateNameOfBucket(body.id, body.name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["media-buckets"] });
            setShowPrompt(false);
            setNewBucketName("");
        },
    });

    // MUTATIONS for media
    const deleteMediaMutation = useMutation({
        mutationFn: (media_id) => deleteMediaById(media_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medias"] });
        },
    });

    /// HANDLERS
    // create new bucket
    function handleCreateBucket() {
        createMutation.mutate(newBucketName);
    }

    // delete bucket based on the id
    function handleDeleteBucket() {
        deleteMutation.mutate(activeBucket);
    }

    // rename bucket's name
    function handleRenameBucket() {
        const body = {
            id: activeBucket,
            name: newBucketName,
        };
        updateNameMutation.mutate(body);
    }

    // Handle successful image upload
    const handleUploadSuccess = (uploadData) => {
        // Optionally refresh bucket data or show success message
        queryClient.invalidateQueries({
            queryKey: ["media-buckets", "medias"],
        });
        setShowImageUpload(false);
    };

    // delete media based on the id
    function handleDeleteMediaById(media_id) {
        deleteMediaMutation.mutate(media_id);
    }

    const bucketsToRender = bucket_id ? data?.childBuckets : data;

    return (
        <div>
            {bucket_id && (
                <div className="media-bucket-intro-cotainer">
                    <div className="media-bucket-intro-heading">
                        {data?.name}
                    </div>
                </div>
            )}

            <div className="media-buckets-container">
                {bucketsToRender?.map((item, ind) => (
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
                        setNewBucketName("");
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

            <div className="list-medias-container">
                <ListOfMedias
                    medias={mediaData}
                    handleDeleteMediaById={handleDeleteMediaById}
                />
            </div>

            {/* Image Upload Section */}
            <div className="image-upload-section" style={{ margin: "20px 0" }}>
                <button
                    className="upload-toggle-btn"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: showImageUpload
                            ? "#dc3545"
                            : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginBottom: "10px",
                    }}
                >
                    {showImageUpload ? "Cancel Upload" : "Upload Image"}
                </button>

                {showImageUpload && (
                    <ImageUpload
                        mediaBucketId={bucket_id}
                        onUploadSuccess={handleUploadSuccess}
                    />
                )}
            </div>
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
