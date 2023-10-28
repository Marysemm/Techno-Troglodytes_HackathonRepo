// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmkYkuebkNqtVpWjzPbVz2LdlfgY-whaU",
  authDomain: "itgirls-hackathon.firebaseapp.com",
  databaseURL: "https://itgirls-hackathon-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "itgirls-hackathon",
  storageBucket: "itgirls-hackathon.appspot.com",
  messagingSenderId: "107281105598",
  appId: "1:107281105598:web:3fe27643b132831e2ad4ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

let email = document.getElementById("email");
let password = document.getElementById("password");

window.login = function (e) {
  e.preventDefault();
  const userData = {
    email: email.value,
    password: password.value,
  };

  signInWithEmailAndPassword(auth, userData.email, userData.password)
    .then(function (success) {
      const userRef = ref(db, 'users/' + success.user.uid);
      get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        const username = userData.username;
        alert("Добро пожаловать на наш сайт!");
        localStorage.setItem("uid", success.user.uid);
        window.location.replace('userPage.html');
      });
    })
    .catch(function (err) {
      alert("Ошибка:" + err);
    });
}