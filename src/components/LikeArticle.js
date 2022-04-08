import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";

const LikeArticle = ({ id, likes }) => {
  const [user] = useAuthState(auth);
  const likesRef = doc(db, "Articles", id);
  const handleLike = () => {
    if (likes?.includes(user.uid)) {
      updateDoc(likesRef, {
        likes: arrayRemove(user.uid),
      })
        .then(() => {
          console.log("unlike");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      updateDoc(likesRef, { likes: arrayUnion(user.uid) })
        .then(() => {
          console.log("like");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div>
      <i
        className={`fa fa-heart${likes?.includes(user.uid) ? "-o" : ""}`}
        style={{
          cursor: "pointer",
          color: likes?.includes(user.uid) ? "red" : null,
        }}
        onClick={handleLike}
      />
    </div>
  );
};

export default LikeArticle;
