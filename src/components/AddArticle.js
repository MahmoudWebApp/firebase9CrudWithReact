import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db, storage } from "../firebase/firebaseConfig";

const AddArticle = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdAt: Timestamp.now().toDate(),
  });
  const [progress, setProgress] = useState(0);
  const handleValue = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImage = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };
  const handlePublish = () => {
    console.log(formData);
    if (!formData.title || !formData.description || !formData.image) {
      alert("Please fill all fields");
      return;
    }
    const storageRef = ref(
      storage,
      `/images/${Date.now()}${formData.image.name}`
    );
    const uploadImage = uploadBytesResumable(storageRef, formData.image);
    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          title: "",
          description: "",
          image: "",
        });
        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const articleRef = collection(db, "Articles");
          addDoc(articleRef, {
            title: formData.title,
            description: formData.description,
            imageUrl: url,
            createdAt: Timestamp.now().toDate(),
            createdBy:user.displayName,
            userId:user.uid,
            likes:[],
            comments:[]
          })
            .then(() => {
              toast("Article added successfully", { type: "success" });
              setProgress(0);
            })
            .catch((err) => {
              toast("Error adding Article", { type: "error" });
            });
        });
      }
    );
  };

  return (
    <div className="border mt-5 p-3 bg-light" style={{ position: "fixed" }}>
      {!user ? (
        <>
          <h2><Link to="/signin">Login to create article</Link></h2>
          Don't have an account? <Link to="/register">Sign up</Link>
        </>
      ) : (
        <>
          <h2>Create Articles</h2>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={(e) => handleValue(e)}
          />

          <label htmlFor="description">description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={(e) => handleValue(e)}
          />

          <label htmlFor="image">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="form-control"
            onChange={handleImage}
          />
          {progress === 0 ? null : (
            <div className="progress" style={{ height: "30px" }}>
              <div
                className="progress-bar progress-bar-striped mt-2"
                style={{
                  width: `${progress}%`,
                  padding: "10px",
                  backgroundColor: "orangered",
                }}
              >
                {`uploading image ${progress}%`}
              </div>
            </div>
          )}

          <button
            className="form-control btn-primary mt-2"
            onClick={handlePublish}
          >
            Publish
          </button>
        </>
      )}
    </div>
  );
};

export default AddArticle;
