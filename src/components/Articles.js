import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import DeleteArticle from "./DeleteArticle";
import LikeArticle from "./LikeArticle";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [user] = useAuthState(auth);
  useEffect(() => {
    const articlesRef = collection(db, "Articles");
    const q = query(articlesRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const articlesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(articlesData);
    });
  }, []);
  return (
    <div>
      {articles.length === 0 ? (
        <p>No articles found</p>
      ) : (
        articles.map(
          ({
            id,
            title,
            description,
            imageUrl,
            createdAt,
            createdBy,
            userId,
            likes,
            comments,
          }) => (
            <article key={id} className="border mt-7 p-3 bg-light">
              <div className="row">
                <div className="col-3">
                  <Link to={`/article/${id}`}>
                    <img
                      src={imageUrl}
                      alt={title}
                      style={{ height: 100, width: 100 }}
                    />
                  </Link>
                </div>
                <div className="col-9 ps-3">
                  <div className="row">
                    <div className="col-6">
                      {createdBy && (
                        <span className="badge bg-primary">{createdBy}</span>
                      )}
                    </div>
                    <div className="col-6 d-flex flex-row-reverse">
                      {user && user.uid === userId && (
                        <DeleteArticle id={id} imageUrl={imageUrl} />
                      )}
                    </div>
                    <h3>{title}</h3>
                    <p>{createdAt.toDate().toDateString()}</p>
                    <h5>{description}</h5>
                    <div className="d-flex flex-row-reverse">
                      {user && <LikeArticle id={id} likes={likes} />}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        )
      )}
    </div>
  );
};

export default Articles;
