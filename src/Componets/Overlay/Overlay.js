import React from "react";
import ReactDOM from "react-dom";
import "./Overlay.css";
const Overlay = () => {
  const modalRoot = document.getElementById("ovelayContanier");
  return ReactDOM.createPortal(<div className="overlay"></div>, modalRoot);
};

export default Overlay;
