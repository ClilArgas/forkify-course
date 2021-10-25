import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try another one';

  addHandlerSortRecipes(handler) {
    document.querySelector('.btn-sort').addEventListener('click', handler);
  }

  _generateMarkup() {
    return this._data.map(prv => previewView.render(prv, false)).join('');
  }
}
export default new ResultsView();
