import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

// for next two imports, in terminal: "npm i core-js regenerator-runtime":
import "core-js/stable"; // polyfilling ES6
import "regenerator-runtime/runtime"; // for polyfilling async/await

//////////////////////
// For Parcel:
if (module.hot) {
  module.hot.accept();
}
//////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // gets the hash from the URL, and removes the #

    if (!id) return; // guard clause for an empty hash (i.e loading home page)
    recipeView.renderSpinner();

    // 0. Update resultsView to mark Selected Search Result
    resultsView.update(model.getSearchResultsPage());

    // 1. Update bookmarksView
    bookmarksView.update(model.state.bookmarks);

    // 2. Loading the recipe
    await model.loadRecipe(id); // async function, returns a promise

    // 3. Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(`THROWN ERROR: ${err} 💥💥💥💥`);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query:
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results:
    await model.loadSearchResults(query);

    // 3. Render results:
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination buttons:
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err}`);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW pagination buttons:
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1. Update the recipe servings (in state)
  model.updateServings(newServings);

  // 2. Update recipeView with updated quantities
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add or Remove bookmark:
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  //3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner while loading:
    addRecipeView.renderSpinner();

    // Upload the newRecipe data:
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render newRecipe to screen:
    recipeView.render(model.state.recipe);

    // Display success message:
    addRecipeView.renderMessage();

    // Render bookmark view:
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL:
    window.history.pushState(null, "", `#${model.state.recipe.id}`); // pushState changes URL without reload

    // Close form modal window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`O_o`, err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); // Publisher-Subscriber pattern
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
