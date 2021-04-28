import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import db, { auth } from './firebase';
import "./Register.css";

function Register() {
    const history = useHistory("");
    const [firstName, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const register = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password).then((auth) => {
            if(auth.user) {
                auth.user.updateProfile({
                    displayName: firstName+ " "+lastname,
                    photoURL: "https://i1.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?ssl=1"
                }).then((s) =>{
                    db.collection('users').doc(auth.user.uid).set({
                        uid: auth.user.uid,
                        displayName: auth.user.displayName,
                        email: auth.user.email,
                        photoURL: "https://i1.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?ssl=1",
                        bio: ""
                    }).then((r) => {
                        history.push("/")
                    })
                })
            }
        })
    }
    return (
        <div className="register">
            <img src="http://katanningrotary.org/wp-content/uploads/2019/04/facebook-text-transparent-logo-23.png" alt="" className="register_logo" />
            <div className="register_container">
                <h1>Sign Up</h1>
                <p>It's quick and easy</p>
                <div className="hr3" />
                <form>
                    <div className="row">
                        <input required  onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                        className="register_name"
                        type="name"
                        placeholder="First Name" />
                        <input required onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                        className="register_name"
                        type="name"
                        placeholder="Last Name" />
                    </div>
                    <center>
                    <input required onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        type="email"
                        placeholder="Email" />
                    </center>
                    <center>
                    <input required onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        type="password"
                        placeholder="Password" />
                    </center>
                    <center>
                        <button onClick={register} type="submit" className="register_register">Sign Up</button>
                    </center>
                    <center>
                        <Link to="/login">
                            <p className="register_login">Already have an account?</p>
                        </Link>
                    </center>
                </form>
            </div>
        </div>
    )
}

export default Register
