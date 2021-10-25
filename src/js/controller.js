import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';
// if (module.hot) {
//   module.hot.accept();
// }
const controllRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0 update results veiw to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);
    // Loading recipe
    await model.loadRecipe(id);
    //Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controllSearchResults = async function () {
  try {
    // get Search query
    resultsView.renderSpinner();
    const query = searchView.getQuery();

    if (!query) return;

    // load the search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage());

    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (page) {
  // render new results

  resultsView.render(model.getSearchResultsPage(page));

  // render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // to get the curr serving,

  model.updateServings(newServings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  // devide each ing by the serving
  // update
};

const controlAddBookmark = function () {
  //Add/remove to bookmark
  model.state.recipe.bookmarked
    ? model.removeBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);
  // update results
  recipeView.update(model.state.recipe);
  // render bookmarks view
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();
    //upload new recipe
    await model.uploadRecipe(newRecipe);

    // render new recipe
    recipeView.render(model.state.recipe);

    //display a success message
    addRecipeView.renderMessage();

    // render Bookmarks
    bookmarkView.render(model.state.bookmarks);

    //Change ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(';;', err);
    addRecipeView.renderError(err.message);
  }
};

const controlSortRecipes = function () {
  // switch the sort
  model.state.search.sort = !model.state.search.sort;
  resultsView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controllRecipe);
  searchView.addHandlerSearch(controllSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  resultsView.addHandlerSortRecipes(controlSortRecipes);
};
init();
