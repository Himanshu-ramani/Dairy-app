import React, { useState, useEffect } from "react";
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import "./CustomerList.css";
import DairyForm from "../DairyForm/DairyForm";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
const CustomerList = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [viewForm, setViewForm] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [oldObject, setOldObject] = useState(null);
  const navigate = useNavigate();
  const fetchData = async () => {
    setLoading(true);
    const collectionRef = collection(db, state.userState);
    const data = await getDocs(collectionRef);
    setCustomer(data.docs.map((doc) => ({ ...doc.data() })));
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getid = (id) => {
    dispatch({
      type: "GETID",
      payload: id,
    });
    navigate(`/customer/${id}`);
  };
  const deleteDairy = async (event, id) => {
    event.stopPropagation();
    await deleteDoc(doc(db, state.userState, id));
    const afterDeleteArray = customer.filter((obj) => obj.phNumber !== id);
    setCustomer(afterDeleteArray);
    console.log("sucess");
  };
  const editDairy = (e, obj) => {
    e.stopPropagation();
    setViewForm(true);
    setOldObject(obj);
  };
  return (
    <>
      {viewForm && (
        <DairyForm
          setViewForm={setViewForm}
          customer={customer}
          setCustomer={setCustomer}
          oldObject={oldObject}
          setOldObject={setOldObject}
        />
      )}
      {loading && <Loading />}
      <table>
        <thead>
          <tr colSpan="4">
            <td colSpan="4">
              {
                <nav className="customer_nav">
                  <h3>Customer List</h3>
                  <Button
                    onClick={() => {
                      setViewForm(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </nav>
              }
            </td>
          </tr>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Balance</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {customer.map((ele) => (
            <tr
              key={ele.phNumber}
              onClick={() => {
                getid(ele.phNumber);
              }}
            >
              <td>{ele.name}</td>
              <td>{ele.phNumber}</td>
              <td>{ele.balance}</td>
              <td className="button_conatiner">
                <FontAwesomeIcon
                  icon={faPencil}
                  onClick={(event) => {
                    editDairy(event, ele);
                  }}
                />

                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={(event) => {
                    deleteDairy(event, ele.phNumber);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CustomerList;
