import React, { useEffect, useState } from "react";
import ProductForm from "../ProductForm/ProductForm";
import { useSelector } from "react-redux";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./ProductsList.css";
import { useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlus,
  faTrash,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";

const ProductsList = () => {
  let { customerId } = useParams();
  const state = useSelector((state) => state);
  const [data, setData] = useState(null);
  const [ShowViewForm, setShowViewForm] = useState(false);
  const [updateObj, setUpdateObject] = useState(null);
  const [productArray, setProductArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    const userDoc = doc(db, state.userState, customerId);
    setLoading(true);
    const docm = await getDoc(userDoc);
    setData({ ...docm.data() });
    setProductArray(docm.data().product);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [customerId]);

  const selectAll = (e) => {
    const newData = data.product.map((ele) => ({
      ...ele,
      checked: e.target.checked,
    }));
    setProductArray(newData);
  };
  const checkHandler = (e, id) => {
    const checkedArray = productArray.map((ele) =>
      ele.id === id ? { ...ele, checked: e.target.checked } : { ...ele }
    );
    setProductArray(checkedArray);
  };
  const deleteProduct = async () => {
    const deleteArray = productArray.filter((ele) => ele.checked !== true);
    const newData = { ...data, product: deleteArray };
    const docRef = doc(db, state.userState, customerId);
    await updateDoc(docRef, newData);
    setProductArray(deleteArray);
    console.log("Success");
  };
  const updateProduct = (ele) => {
    setUpdateObject(ele);
    setShowViewForm(true);
  };
  const exportPdf = () => {
    const pdf = new jsPDF();
    pdf.text(`${data.name}`, 20, 10);
    pdf.autoTable({
      body: [
        ...productArray.map((ele) => ({
          name: ele.name,
          qty: ele.qty,
          time: ele.time,
          date: ele.date,
          price: ele.price,
        })),
        {
          name: "",
          qty: "",
          time: "",
          date: "total",
          price: productArray.reduce((sum, li) => sum + Number(li.price), 0),
        },
      ],
    });

    pdf.save(`${data.name}productList.pdf`);
  };
  return (
    <div>
      {ShowViewForm && (
        <ProductForm
          data={data}
          setShowViewForm={setShowViewForm}
          id={customerId}
          setProductArray={setProductArray}
          updateObject={updateObj}
          setUpdateObject={setUpdateObject}
        />
      )}
      {!loading && (
        <table>
          <thead>
            <tr>
              <td colSpan="7">
                {productArray.filter((ele) => ele.checked === true).length ===
                  0 && (
                  <div className="custmorList">
                    <h3>Product list({data.name})</h3>
                    <div className="button_conatiner">
                      <FontAwesomeIcon
                        icon={faPlus}
                        onClick={() => {
                          setShowViewForm(true);
                        }}
                      />
                      <FontAwesomeIcon icon={faPrint} onClick={exportPdf} />
                    </div>
                  </div>
                )}
                {productArray.filter((ele) => ele.checked === true).length !==
                  0 && (
                  <div className="Delete_nav">
                    <h3>
                      Products(
                      {
                        productArray.filter((ele) => ele.checked === true)
                          .length
                      }
                      )
                    </h3>
                    <FontAwesomeIcon icon={faTrash} onClick={deleteProduct} />
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <th>
                <input type="checkbox" onChange={selectAll} />
              </th>
              <th>Name</th>
              <th>Qty.</th>
              <th>Time</th>
              <th>Date</th>
              <th>Price </th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              productArray.map((ele) => (
                <tr key={ele.id}>
                  <td>
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      onChange={(e) => {
                        checkHandler(e, ele.id);
                      }}
                      checked={ele.checked}
                    />
                  </td>
                  <td>{ele.name}</td>
                  <td>{ele.qty}</td>
                  <td>{ele.time}</td>
                  <td>{ele.date}</td>
                  <td>{ele.price}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faPencil}
                      className="pencil_icon"
                      onClick={() => {
                        updateProduct(ele);
                      }}
                    />
                  </td>
                </tr>
              ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>Total</td>
              <td>
                {productArray.reduce((sum, li) => sum + Number(li.price), 0)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default ProductsList;
