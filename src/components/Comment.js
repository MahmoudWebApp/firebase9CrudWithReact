import React, { useEffect, useState } from "react";
import {
  arrayUnion,
  arrayRemove,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuidv4 } from "uuid";

const Comment = ({ id }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);
  const [currentlyLoggedUser] = useAuthState(auth);
  const commentRef = doc(db, "Articles", id);
  useEffect(() => {
    const docRef = doc(db, "Articles", id);
    onSnapshot(docRef, (snapshot) => {
      setComments(snapshot.data().comments);
    });
  }, [id]);
  const handleDeleteComment = (comment) => {
    console.log(comment);
    updateDoc(commentRef, {
      comments: arrayRemove(comment),
    })
      .then((e) => console.log(e))
      .catch((error) => console.log(error));
  };
  const handleChangeComment = (e) => {
    if (e.key === "Enter") {
      updateDoc(commentRef, {
        comments: arrayUnion({
          user: currentlyLoggedUser.uid,
          userName: currentlyLoggedUser.displayName,
          comment: comment,
          createdAt: new Date(),
          commentId: uuidv4(),
        }),
      }).then(() => {
        setComment("");
      });
    }
  };
  return (
    <div className="container">
      {comments !== null &&
        comments.map(({ commentId, user, comment, userName, createdAt }) => (
          <div key={commentId}>
            <div className="border p-2 mt-2 row">
              <div className="col-11">
                <span
                  className={`badge ${
                    user === currentlyLoggedUser.uid
                      ? "bg-success"
                      : "bg-primary"
                  }`}
                >
                  {userName}
                </span>
                {comment}
              </div>
              <div className="col-1">
                {user === currentlyLoggedUser.uid && (
                  <i
                    className="fa fa-times"
                    style={{ curser: "pointer" }}
                    onClick={()=>handleDeleteComment({
                      commentId,
                      user,
                      comment,
                      userName,
                      createdAt,
                    })}
                  ></i>
                )}
              </div>
            </div>
          </div>
        ))}
      {currentlyLoggedUser && (
        <input
          type="text"
          className="form-control mt-4 mb-5"
          value={comment}
          placeholder="add comment"
          onChange={(e) => setComment(e.target.value)}
          onKeyUp={(e) => handleChangeComment(e)}
        />
      )}
    </div>
  );
};

export default Comment;
