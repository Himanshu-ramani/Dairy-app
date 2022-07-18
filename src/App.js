import { useEffect } from "react";
import "./App.css";
import Nav from "./Componets/Nav/Nav";
import CustomerList from "./Componets/CustomerList/CustomerList";
import AuthForm from "./Componets/AuthForm/AuthForm";
import { useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProductsList from "./Componets/Products/ProductsList";
import Home from "./Componets/Home/Home";

function App() {
  const navigate = useNavigate();
  const state = useSelector((state) => state);

  useEffect(() => {
    if (state.userState) {
      navigate("/customerList");
    }
    if (!state.userState) {
      navigate("/");
    }
  }, [state.userState]);

  return (
    <div className="App">
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Authentication/:authStatus" element={<AuthForm />} />
        <Route path="/customerList" element={<CustomerList />} />
        <Route path="/customer/:customerId" element={<ProductsList />} />
      </Routes>
    </div>
  );
}

export default App;
