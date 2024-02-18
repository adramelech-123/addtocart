// Import firebase code to access firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// SetUp Database
const appSettings = {
  databaseUrl: "https://playground-e8568-default-rtdb.firebaseio.com/",
  projectId: "playground-e8568",
};

// Initialize Firebase App
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addBtn = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const messageBox = document.getElementById("message");

function clearInputField() {
  inputFieldEl.value = "";
}

function clearShoppingList() {
  shoppingListEl.innerHTML = "";
}

function clearMessageBox() {
  messageBox.innerHTML = "";
}

function appendShoppingList(item) {
  
  let itemID = item[0];
  let itemValue = item[1];

  let newItem = document.createElement("li");
  newItem.textContent = itemValue;
  shoppingListEl.append(newItem);

  // Delete item in list
  newItem.addEventListener("dblclick", function () {
    let itemLocation = ref(database, `shoppingList/${itemID}`);
    remove(itemLocation);

    // Pop-up message after deleting an item
    clearMessageBox();
    messageBox.innerHTML += `Deleted ${itemValue}!`;

    setTimeout(function () {
      clearMessageBox();
    }, 1000);
  });
}

// Add Button to push items into the database
addBtn.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  // the push module enables us to push items into the database
  push(shoppingListInDB, inputValue);
  clearInputField();
});

// Fetch Data

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingListArray = Object.entries(snapshot.val());

    clearShoppingList();

    // Render items
    for (let i = 0; i < shoppingListArray.length; i++) {
      let currentItem = shoppingListArray[i];

      appendShoppingList(currentItem);
    }

  }

  else {
    shoppingListEl.innerHTML = `<li id="no-cart" style="background-color: #EEF0F4;">No items in cart!</li>`
  }
});


