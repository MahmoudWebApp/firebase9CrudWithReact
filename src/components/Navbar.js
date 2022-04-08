import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Navbar = () => {
  const [user] = useAuthState(auth);
  return (
    <div className="fixed-top border" style={{ backgroundColor: "whitesmoke" }}>
      <nav className="navbar">
        <div>
          <img
            src="logo192.png"
            width={30}
            heigh={30}
            alt="logo"
            className="ms-5"
          />
        </div>
        <Link className="nav-link" to="/">
          Home
        </Link>
        {user && (
          <>
            <span className="pe-4">Signed is as {user.displayName||user.email}</span>
         <button className="btn btn-primary btn-sm me-3"
         onClick={()=>signOut(auth)}>Logout</button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
