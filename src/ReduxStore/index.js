import { createStore, combineReducers } from "redux";

const userState = (
  state = JSON.parse(localStorage.getItem("user")) || null,
  action
) => {
  if (action.type === "SIGNUP") {
    return (state = action.payload);
  }
  if (action.type === "LOGOUT") {
    return (state = action.payload);
  }
  return state;
};
const collectionId = (state = null, action) => {
  if (action.type === "GETID") {
    return (state = action.payload);
  }
  return state;
};

const store = createStore(combineReducers({ userState, collectionId }));

export default store;
