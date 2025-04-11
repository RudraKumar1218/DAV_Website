// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWcYtCaNbQfpNIlK94hSlVGCzuJg6OS7M",
  authDomain: "fees-history.firebaseapp.com",
  projectId: "fees-history",
  storageBucket: "fees-history.appspot.com",
  messagingSenderId: "732972420316",
  appId: "1:732972420316:web:47b0f087bd4d56233ab819",
  measurementId: "G-2R7N7BJ1QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
export default db;