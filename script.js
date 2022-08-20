"use strict";
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const input = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const groceryList = document.querySelector(".grocery-list");
const btnClear = document.querySelector(".clear-btn");

let edit = false;
let editElement;
let editId;

const getLocalStorage = JSON.parse(localStorage.getItem("items"));
let items = getLocalStorage ? getLocalStorage : [];

form.addEventListener("submit", addList);

btnClear.addEventListener("click", clearItems);

function addList(e) {
  e.preventDefault();

  if (input.value && !edit) {
    const groceryItem = {
      id: getId(),
      item: input.value,
    };

    //add to array of items
    items.push(groceryItem);
    createList(groceryItem);
    addToLocalStorage(items);
    alertMessage("Item Added To The List", "alert-success");

    //alert
  } else if (input.value && edit) {
    editElement =
      e.currentTarget.nextElementSibling.firstElementChild.firstElementChild
        .firstElementChild;
    editElement.innerHTML = input.value;
    editToLocalStorage(editId, input.value);
    resetItems();
    alertMessage("Value Changed", "alert-success");
  } else {
    alertMessage("Please Enter Value", "alert-danger");
  }
}

//generating id
function getId() {
  return Math.floor(new Date() * Math.random());
}

//alert message
function alertMessage(message, color) {
  alert.innerHTML = message;
  alert.classList.add(color);
  setTimeout(() => {
    alert.innerHTML = "";
    alert.classList.remove(color);
  }, 2000);
}

function createList(groceryItem) {
  const { id, item } = groceryItem;
  groceryList.innerHTML += `
          <article class="grocery-item" data-id=${id}>
            <p class="title">${item}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn" onclick = "editItem('${id}','${item}')"; >
                <i class="bi-pencil-square"></i>
              </button>
              <button type="button" class="delete-btn" onclick="deleteItem(${id})">
                <i class="bi-trash-fill"></i>
              </button>
            </div>
          </article>
          `;

  //show container only if there are items
  container.classList.add("show-container");

  input.value = "";
  input.focus();
}

//edit item
function editItem(id, item) {
  input.value = item;
  editId = id;
  edit = true;
  submitBtn.innerHTML = "Edit";
}

//delete item
function deleteItem(id) {
  console.log(id);
  items = items.filter((item) => item.id !== id);
  alertMessage("Item Removed", "alert-danger");
  resetItems();
  addToLocalStorage(items);
}

//clear items
function clearItems() {
  if (items.length > 0) {
    items = [];
    container.classList.remove("show-container");
    localStorage.clear("items");
    resetItems();
    alertMessage("Empty List", "alert-danger");
  }
}

//reset items
function resetItems() {
  edit = false;
  editId = "";
  submitBtn.innerHTML = "Submit";
  groceryList.innerHTML = "";
  items.forEach(createList);
}
resetItems();

//add to local storage
function addToLocalStorage() {
  localStorage.setItem("items", JSON.stringify(items));
}

// edit Local Storage
function editToLocalStorage(id, value) {
  items = items.map((item) => {
    if (item.id === id) {
      item.item = value;
    }
    return item;
  });

  addToLocalStorage(items);
}
