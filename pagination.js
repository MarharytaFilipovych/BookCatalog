export class Pagination {
    #pageCount = 0;
    #currentPage = 1;
    #visiblePages = [];
    #buttonStates = { leftArrow: false, rightArrow: false };

    constructor(currentPage, perPage, totals) {
        this.setPageCount(totals, perPage);
        this.#currentPage = currentPage;
        this.#visiblePages = this.determinePageToShow(currentPage, this.#pageCount);
        this.#buttonStates = {
            leftArrow: this.#visiblePages[0] > 1,
            rightArrow: this.#visiblePages[this.#visiblePages.length - 1] < this.#pageCount
        };
    }

    determinePageToShow(activePage, pageCount) {
        if (pageCount <= 5 || activePage <= 3) return Array.from({ length: Math.min(5, pageCount) }, (_, i) => i + 1);
        if (activePage > pageCount - 3) return Array.from({ length: 5 }, (_, i) => pageCount - 4 + i);
        return [activePage - 2, activePage - 1, activePage, activePage + 1, activePage + 2];
    }

    changePage(newPage) {
        this.#currentPage = newPage;
        this.updateVisiblePages();
        this.updateButtonStates();
    }

    updateVisiblePages() {
        this.#visiblePages = this.determinePageToShow(this.#currentPage, this.#pageCount);
    }

    updateButtonStates() {
        this.#buttonStates = {
            leftArrow: this.#visiblePages[0] > 1,
            rightArrow: this.#visiblePages[this.#visiblePages.length - 1] < this.#pageCount
        };
    }

    onLeftArrowClick() {
        if (this.#visiblePages[0] <= 1) return;
        this.#visiblePages = this.#visiblePages.map(p => p - 1);
        this.updateButtonStates();
    }

    onRightArrowClick() {
        if (this.#visiblePages[this.#visiblePages.length - 1] >= this.#pageCount) return;
        this.#visiblePages = this.#visiblePages.map(p => p + 1);
        this.updateButtonStates();
    }

    get currentPage() {
        return this.#currentPage;
    }

    get visiblePages() {
        return this.#visiblePages;
    }

    get buttonStates() {
        return this.#buttonStates;
    }

    get pageCount() {
        return this.#pageCount;
    }

    setPageCount(totals, perPage) {
        this.#pageCount = Math.ceil(totals / perPage);
    }
}