// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const auth = getAuth()
const db = getDatabase();

const fullName = document.getElementById("fullname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const copassword = document.getElementById("copassword")

window.signup = function (e) {
  e.preventDefault();

  if (fullName.value === "" || email.value === "" || password.value === "") {
    alert("Заполните все поля!");
    return;
  }

  if (password.value !== copassword.value) {
    alert("Пароли не совпадают!");
    return;
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(function (userCredential) {
      // Создание объекта с данными пользователя
      const userData = {
        fullName: fullName.value,
        email: email.value,
      };

      // Сохранение в базе данных Realtime Database
      set(db, ref(db, 'users/' + userCredential.user.uid), userData)
        .then(() => {
          window.location.replace('login.html');
          alert("Вы зарегистрированы!");
        })
        .catch((error) => {
          alert("Ошибка при сохранении данных пользователя: " + error);
        });
    })
    .catch(function (error) {
      alert("Ошибка при регистрации: " + error);
    });
};