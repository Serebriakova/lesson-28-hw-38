"use strict";

const view = {
  controller: null,
  formId: "todoForm",
  todoContainerId: "todoItems",
  form: null,
  todoContainer: null,
  currentItemId: 0,
  removeAllBtn: null,
  clearAllBtn: null,

  getForm() {
    if (!this.formId) throw new Error("No form id");
    this.form = document.getElementById(this.formId);
  },

  getTodoContainer() {
    if (!this.todoContainerId) throw new Error("No todoContainerId");
    this.todoContainer = document.getElementById(this.todoContainerId);
  },

  getRemoveAllBtn() {
    this.removeAllBtn = this.form.querySelector(".remove-all");
  },

  getClearAllBtn() {
    this.clearAllBtn = this.form.querySelector(".clear");
  },

  setEvents() {
    this.form.addEventListener("submit", this.formHandler.bind(this));

    document.addEventListener("DOMContentLoaded", this.appendData.bind(this));

    this.todoContainer.addEventListener("click", this.itemClicked.bind(this));

    this.removeAllBtn.addEventListener(
      "click",
      this.removerAllTodos.bind(this)
    );

    this.clearAllBtn.addEventListener("click", this.clearAll.bind(this));
  },

  formHandler(event) {
    event.preventDefault();
    ++this.currentItemId;
    let data = Array.from(
      event.target.querySelectorAll("input, textarea")
    ).reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {});
    data.itemId = this.currentItemId;
    data.completed = false;
    this.controller.setData(data, this.formId);
    this.todoContainer.prepend(this.createTemplate(data));

    event.target.reset();
  },

  appendData() {
    const data = this.controller.getData(this.formId);
    if (data === null || data.length === 0) return;

    this.currentItemId = data[data.length - 1].itemId;
    data.forEach((todoItem) => {
      this.todoContainer.prepend(this.createTemplate(todoItem));
    });
  },

  itemClicked({ target }) {
    if (target.classList.contains("remove-item")) {
      this.removeTodo({ target });
    } else {
      this.checkTodoItem({ target });
    }
  },

  removeTodo({ target }) {
    this.controller.removeElement(
      target.getAttribute("data-item-id"),
      this.formId
    );
    target.closest(".taskWrapper").parentElement.remove();
  },

  removerAllTodos() {
    this.controller.removeAll(this.formId);
    this.todoContainer.innerHTML = "";
  },

  checkTodoItem({ target }) {
    const itemId = target.getAttribute("data-item-id");
    const status = target.checked;

    this.controller.changeCompleted(itemId, this.formId, status);
  },

  clearAll() {
    Array.from(this.form.querySelectorAll("input, textarea")).forEach(
      (item) => {
        item.value = "";
      }
    );
  },

  createTemplate({ title, description, itemId, completed }) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("col-4");

    let innerContent = `<div class="taskWrapper">`;
    innerContent += `<div class="taskHeading">${title}</div>`;
    innerContent += `<div class="taskDescription">${description}</div>`;
    innerContent += `<hr>`;
    innerContent += `<div class="form-check">`;
    innerContent += `<label class="form-check-label" for="flexCheckDefault">`;
    innerContent += `<input data-item-id="${itemId}" class="form-check-input completedCheckbox" type="checkbox" value="" id="flexCheckDefault">`;

    innerContent += `Completed?`;
    innerContent += `</label>`;
    innerContent += `</div>`;
    innerContent += `<hr>`;
    innerContent += `<button class="btn btn-danger remove-item" data-item-id="${itemId}">Remove</button>`;
    innerContent += `</div>`;

    wrapper.innerHTML = innerContent;
    wrapper.querySelector("input[type=checkbox]").checked = completed;
    return wrapper;
  },

  init(controllerInstance) {
    this.controller = controllerInstance;
    this.getForm();
    this.getTodoContainer();
    this.getRemoveAllBtn();
    this.getClearAllBtn();
    this.setEvents();
  },
};
