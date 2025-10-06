import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCvCTBF49zVlJ-LDdVz8OQUKGDuyzfOnp4",
  authDomain: "board-b7aaa.firebaseapp.com",
  projectId: "board-b7aaa",
  storageBucket: "board-b7aaa.firebasestorage.app",
  messagingSenderId: "99939889835",
  appId: "1:99939889835:web:12a8fd69d4cc08e1f2bdee"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db= getFirestore( firebaseApp);


export {db} ;
