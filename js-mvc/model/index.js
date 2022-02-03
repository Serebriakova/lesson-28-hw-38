"use strict";

const model = {
  saveData(data, dbKey) {
    if (!localStorage.getItem(dbKey)) {
      localStorage.setItem(dbKey, JSON.stringify([data]));
      return true;
    }

    const currentData = JSON.parse(localStorage.getItem(dbKey));
    currentData.push(data);

    localStorage.setItem(dbKey, JSON.stringify(currentData));
    return true;
  },

  getData(dbKey) {
    return JSON.parse(localStorage.getItem(dbKey));
  },

  changeCompleted(itemId, dbKey, status) {
    const data = JSON.parse(localStorage.getItem(dbKey));
    const currentItem = data.find((todoItem) => todoItem.itemId === +itemId);

    currentItem.completed = status;

    localStorage.setItem(dbKey, JSON.stringify(data));
  },

  deleteItem(id, dbKey) {
    const data = JSON.parse(localStorage.getItem(dbKey));
    const index = data.findIndex((todoItem) => todoItem.itemId === id);
    data.splice(index, 1);

    localStorage.setItem(dbKey, JSON.stringify(data));
  },

  clearStorage(dbKey) {
    localStorage.removeItem(dbKey);
  },

  init(controllerInstance) {
    this.controller = controllerInstance;
  },
};
