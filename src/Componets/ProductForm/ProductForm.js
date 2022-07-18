import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import Overlay from "../Overlay/Overlay";
import "./ProductForm.css";
const ProductForm = ({
  setProductArray,
  data,
  setShowViewForm,
  id,
  setUpdateObject,
  updateObject,
}) => {
  const state = useSelector((state) => state);
  const [productData, setProductData] = useState({
    name: "",
    qty: "",
    price: "",
  });
  const [validInput, setValidInput] = useState({
    name: false,
    qty: false,
    price: false,
  });
  useEffect(() => {
    if (updateObject) {
      setProductData((pre) => ({ ...pre, ...updateObject }));
    }
  }, []);
  const inputChangeHanlder = (e) => {
    const { name, value } = e.target;
    setProductData((pre) => ({ ...pre, [name]: value }));
  };
  const validation = () => {
    for (const key in validInput) {
      if (productData[key] === "") {
        setValidInput((pre) => ({ ...pre, [key]: true }));
      } else {
        setValidInput((pre) => ({ ...pre, [key]: false }));
      }
    }
  };
  const onBlurHandler = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setValidInput((pre) => ({ ...pre, [name]: true }));
    } else {
      setValidInput((pre) => ({ ...pre, [name]: false }));
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    validation();
    for (const key in validInput) {
      if (productData[key] === "") {
        return;
      }
    }
    if (updateObject) {
      console.log(productData);
      const newUpdateArray = data.product.map(
        (obj) => [productData].find((o) => o.id === obj.id) || obj
      );
      setProductArray(newUpdateArray);
      data.product = newUpdateArray;
      const docRef = doc(db, state.userState, id);
      await updateDoc(docRef, data);
      console.log("sucess");
      setUpdateObject(null);
    } else {
      let d = new Date(); // for now
      const dataObject = {
        ...productData,
        time: `${d.getHours()}:${d.getMinutes()}`,
        date: `${d.toISOString().split("T")[0]}`,
        id: `${d.getHours()}:${d.getMinutes()}` + Math.random(),
        checked: false,
      };
      data.product.push(dataObject);
      const docRef = doc(db, state.userState, id);
      await updateDoc(docRef, data);
      console.log("Success");
      setProductArray((pre) => [...pre, dataObject]);
    }
    setShowViewForm(false);
  };
  return (
    <>
      <Overlay />
      <div>
        <form onSubmit={onSubmit} className="productForm">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            id="name"
            value={productData.name}
            onBlur={onBlurHandler}
            onChange={inputChangeHanlder}
          />
          {validInput.name && (
            <p className="error_message_product">Please input Product Name</p>
          )}
          <label htmlFor="qty">Qty</label>
          <input
            type="text"
            name="qty"
            placeholder="Qty."
            id="qty"
            value={productData.qty}
            onBlur={onBlurHandler}
            onChange={inputChangeHanlder}
          />
          {validInput.qty && (
            <p className="error_message_product">Please input Product Name</p>
          )}
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            id="price"
            placeholder="Price"
            value={productData.price}
            onBlur={onBlurHandler}
            onChange={inputChangeHanlder}
          />
          {validInput.price && (
            <p className="error_message_product">Please input Product Name</p>
          )}
          <div className="button_container">
            <button type="submit" className="submit">
              Add
            </button>
            <button
              className="cancel"
              onClick={() => {
                setShowViewForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
