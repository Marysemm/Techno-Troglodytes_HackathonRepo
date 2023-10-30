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

const user = auth.currentUser;
const title = document.getElementById("title");
const description = document.getElementById("description");
const duration = document.getElementById("duration");
const isDone = false;
const id = localStorage.getItem("uid");
const addBtn = document.getElementById("add-btn");

function displayTasks() {
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = "";
    const tasksRef = ref(db, "Tasks/" + id);
    onChildAdded(tasksRef, (childSnapshot) => {
        const task = childSnapshot.val();
        const isDoneClass = task.isDone ? "isDone" : "notDone";
        const taskItem = document.createElement("div");
        taskItem.classList.add("grid-wrap");
        taskItem.innerHTML = `
        <div class="${isDoneClass}">
        <h3 class="task-title">${task.title}</h3>
        <p class="task-description">${task.description}</p>
        <p class="task-duration">${task.duration}</p>
        <button class="delete-button">Удалить</button></div>`;
        tasksContainer.appendChild(taskItem);
        const deleteButton = taskItem.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
            deleteTask(childSnapshot.key);
        });
    })
}

addBtn.addEventListener('click', setData);

function setData() {
    try {
        const user = auth.currentUser;
        const id = user ? user.uid : null;
        if (!id) return;
        const dbRef = ref(db);
        const taskRef = push(child(dbRef, "Tasks/" + id));
        set(taskRef, {
            title: title.value,
            description: description.value,
            duration: Number(duration.value),
            isDone: isDone
        });
    } catch (error) {
        console.log(error);
    }
}

function clearForm() {
    title.value = "";
    description.value = "";
    duration.value = "";
}

function deleteTask(taskId) {
    const taskRef = ref(db, "Tasks/" + id + "/" + taskId);
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

window.logout = function () {
    signOut(auth)
        .then(function () {
            alert("Пока!");
            window.location.href = "../../index.html";
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
            window.location.href = "../../index.html";
        }
    });
}

checkAuthentication();

window.onload = function () {
    const userRef = ref(db, 'users/' + id);
    get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        const username = userData.fullName;
        const userSet = document.getElementById("personal-set");
        const userGreetings = document.createElement("div");
        userGreetings.classList.add("personal-greetings");
        userGreetings.innerHTML = `
        <h4 class="welcome-phrase">Добро пожаловать, ${username}</h4>`;
        userSet.appendChild(userGreetings);
        displayTasks();
    })
}