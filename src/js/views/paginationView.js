import View from './View.js';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clicked = e.target.closest('.btn--inline');
      if (!clicked) return;
      const goToPage = +clicked.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currPage = this._data.page;
    // Page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return (
        this._generateMarkupButton(currPage + 1, 'next', 'right') +
        `<p class="preview__publisher">${currPage}/${numPages}</p>`
      );
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      return (
        `<p class="preview__publisher">${currPage}/${numPages}</p>` +
        this._generateMarkupButton(currPage - 1, 'prev', 'left')
      );
    }
    // Other pages
    if (currPage > 1 && currPage < numPages) {
      return (
        this._generateMarkupButton(currPage - 1, 'prev', 'left') +
        `<p>${currPage}/${numPages}</p>` +
        this._generateMarkupButton(currPage + 1, 'next', 'right')
      );
    }
    return ``;
  }
  _generateMarkupButton(page, list, direction) {
    return ` <button data-goto="${page}" class="btn--inline pagination__btn--${list}">
    <span>Page ${page}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-${direction}"></use>
    </svg>
  </button>`;
  }
}
export default new PaginationView();
