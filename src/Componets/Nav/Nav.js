import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Nav.css";
import Button from "../Button/Button";
import { auth } from "../../firebase/firebase";
const Nav = () => {
  //
  const [logoName, setLogoName] = useState(null);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    localStorage.setItem("user", JSON.stringify(null));
  };
  //
  const user = auth.currentUser;
  useEffect(() => {
    if (user !== null) {
      const displayName = user.displayName;
      const shortName = displayName
        .split(" ")
        .map((x) => x[0])
        .join("")
        .toUpperCase();
      setLogoName(shortName);
    }
  }, [state.userState, logoName, user]);
  //
  return (
    <nav className="nav">
      <div>Online Dariy</div>
      {state.userState && (
        <>
          <ul>
            <li>
              <Link className="link_sigin" to="/customerList">
                Customer List
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Button onClick={logOut}>Log Out</Button>
            </li>
            <li>
              {logoName && <div className="logo_shortName">{logoName}</div>}
            </li>
          </ul>
        </>
      )}
      {!state.userState && (
        <ul>
          <li>
            <Button className="create_button">
              <Link className="link_sigin" to="/Authentication/SignUp">
                Create Account
              </Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link className="link_sigin" to="/Authentication/LogIn">
                Log in
              </Link>
            </Button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Nav;
