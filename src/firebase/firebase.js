import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBH9c812huWbSAWbRaY9kZPj3RG-u5kK0k",
  authDomain: "dairy-26fd1.firebaseapp.com",
  projectId: "dairy-26fd1",
  storageBucket: "dairy-26fd1.appspot.com",
  messagingSenderId: "315505382021",
  appId: "1:315505382021:web:fdc03312c0092058d80fec",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
