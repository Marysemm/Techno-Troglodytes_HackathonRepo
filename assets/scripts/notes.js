// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, get, set, child, push, remove, onChildAdded } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import {
    getAuth,
    signOut,
    onAuthStateChanged,
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
const db = getDatabase();

// References

const title = document.getElementById("title");
const description = document.getElementById("description");
const id = localStorage.getItem("uid");
const addBtn = document.getElementById("add-btn");
const deleteBtn = document.getElementById("delete-btn");

function deleteTask(id) {
    const taskRef = ref(db, "Tasks/" + id);
    remove(taskRef)
        .then(() => {
            alert("Задача успешно удалена");
            clearForm();
            displayTasks();
        })
        .catch((error) => {
            alert("Упс! Произошла ошибка:" + error);
        });
}

function displayTasks() {
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = "";
    const tasksRef = ref(db, "Tasks");
    onChildAdded(tasksRef, (childSnapshot) => {
        const task = childSnapshot.val();
        const taskItem = document.createElement("div");
        taskItem.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <button class="delete-button">Удалить</button>`;
            tasksContainer.appendChild(taskItem);

            const deleteButton = taskItem.querySelector(".delete-button");
            deleteButton.addEventListener("click", () => {
                deleteTask(childSnapshot.key);
    });
})
}

function clearForm() {
    title.value = "";
    description.value = "";
}

function setData() {
    const newTaskRef = push(child(ref(db), "Tasks"));
    const newTaskId = newTaskRef.key;
    set(newTaskRef, {
        title: title.value,
        description: description.value,
        uid: newTaskId
    })
        .then(() => {
            alert("Задача успешно добавлена");
            clearForm();
            displayTasks();
        })
        .catch((error) => {
            alert("Упс! Произошла ошибка:" + error);
        });
}

window.logout = function () {
    signOut(auth)
        .then(function () {
            alert("Пока!");
            window.location.href = "login.html";
        })
        .catch(function (err) {
            console.log(err);
        });
};

function checkAuthentication() {
    onAuthStateChanged(auth, function (user) {
        if (user) {
            const uid = user.uid;
            console.log(uid);
        } else {
            // User is signed out
            window.location.href = "login.html";
        }
    });
}

checkAuthentication();

window.onload = function() {
    displayTasks();
};

addBtn.addEventListener('click', setData);