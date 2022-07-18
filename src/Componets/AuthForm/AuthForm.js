import React, { useState } from "react";
import "./AuthForm.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useDispatch } from "react-redux";
import Button from "../Button/Button";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
const AuthFrom = () => {
  const { authStatus } = useParams();

  const [inputData, setInputData] = useState(
    authStatus === "SignUp"
      ? {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        }
      : { email: "", password: "" }
  );
  const [isValid, setIsValid] = useState({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  });
  const dispatch = useDispatch();
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputData((pre) => ({ ...pre, [name]: value }));
    if (name === "email") {
      let pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );

      if (!pattern.test(value)) {
        // has error
      } else {
        // remove error
      }
    }
  };
  //onblurHandler
  const blurHandler = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setIsValid((pre) => ({ ...pre, [name]: false }));
    } else {
      setIsValid((pre) => ({ ...pre, [name]: true }));
    }
  };
  //validation
  const validation = () => {
    for (const key in inputData) {
      if (inputData[key] === "") {
        setIsValid((pre) => ({ ...pre, [key]: false }));
      } else {
        setIsValid((pre) => ({ ...pre, [key]: true }));
      }
    }
  };
  const SubmitAuth = async (e) => {
    e.preventDefault();
    validation();
    for (const key in inputData) {
      if (inputData[key] === "") {
        return;
      }
    }
    if (Object.values(isValid).includes(false)) {
      return;
    }
    if (authStatus === "SignUp") {
      const res = await createUserWithEmailAndPassword(
        auth,
        inputData.email,
        inputData.password
      );
      localStorage.setItem("user", JSON.stringify(res._tokenResponse.localId));
      dispatch({
        type: "SIGNUP",
        payload: res._tokenResponse.localId,
      });
      toast.success("Create account SuccessFully");
      const userCollectionRef = collection(db, "usersList");
      await addDoc(userCollectionRef, inputData);
      await updateProfile(auth.currentUser, {
        displayName: inputData.firstName + " " + inputData.lastName,
      });
    }
    if (authStatus === "LogIn") {
      const res = await signInWithEmailAndPassword(
        auth,
        inputData.email,
        inputData.password
      );
      localStorage.setItem("user", JSON.stringify(res._tokenResponse.localId));
      dispatch({
        type: "SIGNUP",
        payload: res._tokenResponse.localId,
      });
    }
  };

  //sign in with google
  const provider = new GoogleAuthProvider();
  const googleSignIn = async () => {
    const result = await signInWithPopup(auth, provider);
    localStorage.setItem("user", JSON.stringify(result._tokenResponse.localId));
    dispatch({
      type: "SIGNUP",
      payload: result._tokenResponse.localId,
    });
  };
  return (
    <>
      <Toaster position="top-center" />
      <div>
        <form onSubmit={SubmitAuth} className="auth_form">
          <h1>{authStatus === "SignUp" ? "Sigin Up" : "Log In"}</h1>
          {authStatus === "SignUp" && (
            <>
              <input
                placeholder="First Name"
                type="text"
                name="firstName"
                onChange={inputChangeHandler}
                onBlur={blurHandler}
                value={inputData.firstName}
              />
              {!isValid.firstName && (
                <p className="error_message">Please enter First name</p>
              )}
              <input
                placeholder="Last Name"
                type="text"
                name="lastName"
                onChange={inputChangeHandler}
                onBlur={blurHandler}
                value={inputData.lastName}
              />
              {!isValid.lastName && (
                <p className="error_message">Please enter Last name</p>
              )}
            </>
          )}
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={inputChangeHandler}
            onBlur={blurHandler}
            value={inputData.email}
          />
          {!isValid.email && (
            <p className="error_message">Please enter Valid Email</p>
          )}
          <input
            type="text"
            placeholder="Password"
            name="password"
            onChange={inputChangeHandler}
            onBlur={blurHandler}
            value={inputData.password}
          />
          {!isValid.password && (
            <p className="error_message">Please enter Password</p>
          )}
          <p className="account_note">
            {authStatus === "SignUp" && (
              <>
                Already have an account.{" "}
                <Link to="/Authentication/LogIn">Log in</Link>{" "}
              </>
            )}
            {authStatus === "LogIn" && (
              <>
                Don't have account Create.{" "}
                <Link to="/Authentication/SignUp">Sign Up</Link>{" "}
              </>
            )}
          </p>
          <Button type="submit" className="submit_button_auth">
            {authStatus === "SignUp" ? "Sigin Up" : "Log In"}
          </Button>
          <Button type="button" onClick={googleSignIn}>
            Sign in with Google
          </Button>
        </form>
      </div>
    </>
  );
};

export default AuthFrom;
