import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import "./Home.css";
import imgHome from "./homeimg.png";
const Home = () => {
  return (
    <div className="home">
      <div className="home_conatiner">
        <img src={imgHome} alt="homepage" />
        <div>
          <h1>Welcome to your Online Credit Sells Dairy </h1>
          <p>
            Get more done with Online sells Entry. Now integrated with Online
            credit sell list and have flexibility tu access your list anywhere
            and now worry to lost physical Dairy and calculation.
          </p>
          <Button>
            <Link className="link_sigin" to="/Authentication/SignUp">
              Let's start !
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
