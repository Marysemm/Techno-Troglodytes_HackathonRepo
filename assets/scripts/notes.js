// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, get, set, update, child, push, remove, onChildAdded } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import {getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
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
        <div class="task">
            <div class="task__header">
                <h3 class="task__title isEditable" contenteditable="false">${task.title}</h3>
                <div class="task__options">
                    <span class="${isDoneClass}"><i class="fa-solid fa-clipboard-check"></i></span>
                    <button class="task__options-btn edit-btn"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="task__options-btn del-btn"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <p class="task__description isEditable" contenteditable="false">${task.description}</p>
            <div class="task__time"><p class="task__duration isEditable" contenteditable="false">${task.duration}</p><span>мин.</span></div>
        </div>`;
        tasksContainer.appendChild(taskItem);
        enableEditFields(childSnapshot) 
        const deleteButton = taskItem.querySelector(".del-btn");
        deleteButton.addEventListener("click", () => {
            deleteTask(childSnapshot.key);
        });
    })
}

function enableEditFields(childSnapshot) {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const taskItem = button.closest('.task');
            const titleField = taskItem.querySelector('.task__title');
            const descriptionField = taskItem.querySelector('.task__description');
            const durationField = taskItem.querySelector('.task__duration');
            // Enable contenteditable attribute
            titleField.contentEditable = 'true';
            descriptionField.contentEditable = 'true';
            durationField.contentEditable = 'true';
            // Add class to indicate it's editable
            titleField.classList.add('isEditable');
            descriptionField.classList.add('isEditable');
            durationField.classList.add('isEditable');
            // Change button class to save-btn
            button.classList.remove('edit-btn');
            button.classList.add('save-btn');
            // Change button text to "Save"
            button.innerHTML ='<i class="fa-regular fa-floppy-disk"></i>';
            // Add event listener to save changes
            button.addEventListener('click', () => {
                saveTaskChanges(childSnapshot, taskItem, titleField, descriptionField, durationField, button);
            });
        });
    });
}

function saveTaskChanges(childSnapshot, taskItem, titleField, descriptionField, durationField, button) {
    const taskId = childSnapshot.key;
    const title = titleField.innerText;
    const description = descriptionField.innerText;
    const duration = Number(durationField.innerText);
    // Save changes to the database
    const taskRef = ref(db, "Tasks/" + id);
    update(child(taskRef, taskId), {
        title: title,
        description: description,
        duration: duration
    })
    .then(() => {
        alert("Изменения сохранены");
        // Disable contenteditable attribute
        titleField.contentEditable = 'false';
        descriptionField.contentEditable = 'false';
        durationField.contentEditable = 'false';
        // Remove editable class
        titleField.classList.remove('isEditable');
        descriptionField.classList.remove('isEditable');
        durationField.classList.remove('isEditable');
        // Change button class and text back to edit
        button.classList.remove('save-btn');
        button.classList.add('edit-btn');
        // Change button text back to "Edit"
        button.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    })
    .catch((error) => {
        alert("Упс! Произошла ошибка:" + error);
    });
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
            window.location.href = "index.html";
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
            window.location.href = "index.html";
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