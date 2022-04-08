import React, { useState } from "react";
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
    const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const handleSingUp= async()=>{
    try{
        await createUserWithEmailAndPassword(auth,formData.email,formData.password);
        updateProfile(auth.currentUser,{displayName:formData.name});
        navigate('/')
    }catch(err){
      toast(err.code,{type:"error"})  
    }
  
}
  return (
    <div className="border p-3 bg-light" style={{ marginTop: 70 }}>
      <h1>Register</h1>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your Name"
          name="name"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter your Email"
          name="email"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter your Password"
          name="password"
          onChange={handleChange}
        />
      </div>
      <br />
      <button className="btn btn-primary" onClick={handleSingUp}>Register</button>
    </div>
  );
};

export default Register;
