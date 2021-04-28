// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyAgPEOl0KXOGJWPdIw-CRthE0a--LPZWZA",
    authDomain: "socialmedia-4c0e3.firebaseapp.com",
    projectId: "socialmedia-4c0e3",
    storageBucket: "socialmedia-4c0e3.appspot.com",
    messagingSenderId: "825491101545",
    appId: "1:825491101545:web:738e0c8541ced4c0f2cff8",
    measurementId: "G-DRJD1P0GXM"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  const storage = firebase.storage();


  export {db, auth, storage, provider};
  export default db;