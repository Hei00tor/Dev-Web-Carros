
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyAnK4Fs7LSMQH5ocdxrTZZi2gSBmd4XsMI",
  authDomain: "webcarros-fe444.firebaseapp.com",
  projectId: "webcarros-fe444",
  storageBucket: "webcarros-fe444.appspot.com",
  messagingSenderId: "236929000273",
  appId: "1:236929000273:web:1032d1e892c8cc30256970"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };