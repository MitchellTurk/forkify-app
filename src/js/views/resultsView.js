import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = `No recipes found for your search query. Please try again!`;
  _message = ``;

  _generateMarkup() {
    // console.log(this._data); // returns our search query passed in from render() in View
    return this._data.map(result => previewView.render(result, false)).join("");
  }
}

export default new ResultsView(); // exporting a single instance makes it such that ONLY one instance can be used, prevents duplicate/additional instances
