import View from "./View.js";
import icons from "url:../../img/icons.svg";

class addRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = `Recipe was successfully uploaded!`;

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
    // must bind the 'this' to the object, otherwise addEventListener will set the 'this' keyword to the _btnOpen it is attached to
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // this points to parEl
      const data = Object.fromEntries(dataArr); // converts array of entries to object
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new addRecipeView();