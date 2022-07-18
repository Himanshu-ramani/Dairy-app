import React, { useState, useEffect } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import "./DairyForm.css";
import Overlay from "../Overlay/Overlay";
const DairyForm = ({
  setViewForm,
  customer,
  setCustomer,
  oldObject,
  setOldObject,
}) => {
  const state = useSelector((state) => state);
  // inistal state of input and validaytion
  const [inputData, setInputData] = useState({
    name: "",
    balance: "",
    phNumber: "",
    phNumber2: "",
    address: "",
  });
  const [inputValid, setInputValid] = useState({
    name: false,
    balance: false,
    phNumber: false,
    phNumber2: false,
    address: false,
  });
  const [numberValid, setNumberValid] = useState({
    phNumber: false,
    phNumber2: false,
  });
  // input state Change
  useEffect(() => {
    if (oldObject) {
      setInputData(oldObject);
    }
  }, []);

  // validation
  const validation = () => {
    for (const key in inputValid) {
      if (inputData[key].trim() === "") {
        setInputValid((pre) => ({ ...pre, [key]: true }));
      }
    }
  };
  const numberArray = Array.prototype.concat.apply(
    [],
    customer.map((ele) => {
      return [ele.phNumber, ele.phNumber2];
    })
  );
  const inputChangeHanlder = (e) => {
    const { name, value } = e.target;
    setInputData((pre) => ({ ...pre, [name]: value }));
    if (name === "phNumber" || name === "phNumber2") {
      if (numberArray.includes(value)) {
        setNumberValid((pre) => ({ ...pre, [name]: true }));
      } else {
        setNumberValid((pre) => ({ ...pre, [name]: false }));
      }
    }
  };
  const blurHandler = (e) => {
    const { name, value } = e.target;
    if (value.trim() === "") {
      setInputValid((pre) => ({ ...pre, [name]: true }));
    } else {
      setInputValid((pre) => ({ ...pre, [name]: false }));
    }
  };
  // submit form
  const submitForm = async (e) => {
    e.preventDefault();

    validation();

    for (const key in inputData) {
      if (inputData[key] === "") {
        return;
      }
    }
    if (Object.values(inputValid).includes(true)) {
      return;
    }
    if (Object.values(numberValid).includes(true)) {
      return;
    }
    if (oldObject) {
      const docRef = doc(db, state.userState, oldObject.phNumber);
      await updateDoc(docRef, { ...oldObject, ...inputData });
      const afterUpdateArray = customer.map(
        (obj) =>
          [{ ...oldObject, ...inputData }].find(
            (o) => o.phNumber === obj.phNumber
          ) || obj
      );
      setCustomer(afterUpdateArray);
      setOldObject(null);
      console.log("Success");
    } else {
      await setDoc(doc(db, state.userState, inputData.phNumber), {
        ...inputData,
        product: [],
      });

      setCustomer((pre) => [...pre, inputData]);
    }
    setViewForm(false);
  };
  return (
    <>
      <Overlay />
      <div>
        <form onSubmit={submitForm} className="dairyForm">
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={inputData.name}
              placeholder="Full Name"
              id="name"
              onChange={inputChangeHanlder}
              onBlur={blurHandler}
            />
            {inputValid.name && (
              <p className="error_message_dairy">Please input Full name</p>
            )}
          </div>
          <div>
            <label htmlFor="balance">Balance</label>
            <input
              type="number"
              name="balance"
              id="balance"
              placeholder="Balance"
              value={inputData.balance}
              onChange={inputChangeHanlder}
              onBlur={blurHandler}
            />
            {inputValid.balance && (
              <p className="error_message_dairy">Please input Balance</p>
            )}
          </div>
          <div>
            <label htmlFor="phNumber">Phone Number</label>
            <input
              type="number"
              name="phNumber"
              value={inputData.phNumber}
              placeholder="Ph. Number"
              onChange={inputChangeHanlder}
              onBlur={blurHandler}
              id="phNumber"
            />
            {numberValid.phNumber ? (
              <p className="error_message_dairy">
                Phone number is alredy in use
              </p>
            ) : (
              inputValid.phNumber && (
                <p className="error_message_dairy">Please input Phone number</p>
              )
            )}
          </div>
          <div>
            <label htmlFor="phNumber2">Temporary Number</label>
            <input
              type="number"
              name="phNumber2"
              value={inputData.phNumber2}
              placeholder="Ph. Number"
              onChange={inputChangeHanlder}
              onBlur={blurHandler}
              id="phNumber2"
            />
            {numberValid.phNumber2 ? (
              <p className="error_message_dairy">
                Phone number is alredy in use
              </p>
            ) : (
              inputValid.phNumber2 && (
                <p className="error_message_dairy">Please input Phone number</p>
              )
            )}
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <textarea
              name="address"
              value={inputData.address}
              placeholder="Address"
              id="address"
              cols="30"
              onChange={inputChangeHanlder}
              onBlur={blurHandler}
              rows="3"
            ></textarea>
            {inputValid.address && (
              <p className="error_message_dairy">Please input Address</p>
            )}
          </div>
          <section>
            <button type="submit" className="submit">
              Submit
            </button>
            <button
              className="cancel"
              onClick={() => {
                setViewForm(false);
                setOldObject(null);
              }}
            >
              Cancel
            </button>
          </section>
        </form>
      </div>
    </>
  );
};

export default DairyForm;
