import React,  { useState } from 'react';
import './ImageUpload.css';
import Dialog from '@material-ui/core/Dialog';
import firebase from "firebase";
import { storage, db, auth } from './firebase';
import CloseIcon from '@material-ui/icons/Close';
import VideocamIcon from '@material-ui/icons/Videocam';
import PhotoIcon from '@material-ui/icons/Photo';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import GroupIcon from '@material-ui/icons/Group';

function ImageUpload() {
    const user = firebase.auth().currentUser;
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [noLikes, setNoLikes] = useState(0);
    const [scroll, setScroll] = React.useState('paper');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
        setImageURL(URL.createObjectURL(e.target.files[0]));
    };

    const uploadFileWithClick = () => {
        document.getElementsByClassName('four')[0].click();
    }

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
        setImage("");
        setImageURL("");
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const handleUpload = (event) => {
        if (document.getElementsByClassName('hidden')[0]) {
            document.getElementsByClassName('hidden')[0].classList.remove('hidden');
        }
        document.getElementsByClassName('postButton').disabled = true;
        document.getElementsByClassName('postButton')[0].classList.add('disabled');

        if (caption == "" && imageURL == "") {
            console.log("Prevented Access to Photo or Caption Submission")
        } else {
            event.preventDefault();
            if (imageURL == '') {
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: "",
                    noLikes: noLikes,
                    username: user?.displayName,
                    uid: user?.uid
                });
                handleClose();
                setProgress(0);
                setCaption("");
                setImage(null);
            } else {
                const uploadTask = storage.ref(`images/${image.name}`).put(image);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        setProgress(progress);
                    },
                    (error) => {
                        console.log(error);
                        alert(error.message);
                    },
                    () => {
                        storage
                            .ref("images")
                            .child(image.name)
                            .getDownloadURL()
                            .then(url => {
                                db.collection("posts").add({
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                    caption: caption,
                                    imageUrl: url,
                                    noLikes: noLikes,
                                    username: user?.displayName,
                                    uid: user?.uid
                                });
                                handleClose();
                                setProgress(0);
                                setCaption("");
                                setImage(null);
                            })
                    }
                )
            }
        }

    }
    return (
        <div className="imageupload">
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
            >
            <div className="makeStyles-paper-1">
                    <div className="modalInit">
                        <h1>Create Post</h1>
                        <CloseIcon className="closeModalIcon" onClick={handleClose} />
                    </div>
                    <div className="hr2" />
                    <div className="profileHead">
                        <img src={user?.photoURL} className="Avatar" />
                        <h1>{user?.displayName}</h1>
                    </div>
                    <div className="inputForUpload">
                        <input onChange={handleChange} type="file" accept="image/*" className='four' />
                        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows="4" placeholder={`What's on your mind, ${user?.displayName}?`} />
                    </div>
                    <div className={`previewImage ${!image && "vanish"}`}>
                        <img src={imageURL} className="previewImaage" />
                    </div>
                    <img alt="" className="colorAlpha" src="https://facebook.com/images/composer/SATP_Aa_square-2x.png"></img>

                    <progress value={progress} className="hidden" max="100" />

                    <div className="publishOptions">
                        <div className="left">
                            <h1>Add to your post</h1>
                        </div>
                        <div className="right">
                            <i className="Icon roomIcon" onClick={uploadFileWithClick} />
                            <PhotoAlbumIcon className="photoAlbum" onClick={uploadFileWithClick} />
                            <GroupIcon className="friendsIcon" />
                            <InsertEmoticonIcon className="feelingIcon" />
                            <i className="Icon tagIcon" />
                            <i className="Icon moreIcon" />
                        </div>
                    </div>
                    <button onClick={handleUpload} type="submit" class={`postButton ${caption.length < 1 && "disabled"} ${imageURL != "" && "visible"}`}>Post</button>
                </div>
        </Dialog>
        <div className="imageupload__container">
                <div className="postArea">
                    <img src={user?.photoURL} className="Avatar" />
                    <input value={caption} onChange={(e) => setCaption(e.target.value)} onClick={handleClickOpen('body')} placeholder={`What's on your mind, ${user?.displayName}?`} />
                </div>
                <div className="hr" />
                <div className="options">
                    <div className="liveVideo" onClick={handleClickOpen('body')}>
                        <VideocamIcon  style={{color: "red"}} className="liveVideoIcon" />
                        <h2>Live video</h2>
                    </div>
                    <div className="photo" onClick={handleClickOpen('body')}>
                        <PhotoIcon className="photoIcon" />
                        <h2>Photo/Video</h2>
                    </div>
                    <div className="feeling" onClick={handleClickOpen('body')}>
                        <InsertEmoticonIcon className="feelingIcon" />
                        <h2>Feeling/Activity</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageUpload
