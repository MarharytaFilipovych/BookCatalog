export class Pagination  {

    constructor(initialPage, pageCount, onPageSelect){
        this.pageCount = pageCount;
        this.onPageSelect = onPageSelect;
        this.currentPage = initialPage;
        this.visiblePages = this.determinePageToShow(initialPage, pageCount);
        this.buttonStates = {
            leftArrow: this.visiblePages[0] > 1,
            rightArrow: this.visiblePages[this.visiblePages.length - 1] < pageCount
        };
    }
    determinePageToShow (activePage, pageCount) {
        if(pageCount <= 5 || activePage <= 3) return Array.from({length: Math.min(5, pageCount)}, (_, i)=>i+1);
        if(activePage > pageCount - 3) return Array.from({length: 5}, (_, i)=> pageCount - 4 + i);
        return [activePage-2, activePage-1, activePage, activePage+1, activePage+2];
    };
    setCurrentPage(page) {
        this.currentPage = page;
        this.updateVisiblePages();
        this.updateButtonStates();
    }

    updateVisiblePages() {
        this.visiblePages = this.determinePageToShow(this.currentPage, this.pageCount);
    }

    updateButtonStates() {
        this.buttonStates = {
            leftArrow: this.visiblePages[0] > 1,
            rightArrow: this.visiblePages[this.visiblePages.length - 1] < this.pageCount
        };
    }
    onPageChange (newPage)  {
        this.onPageSelect(newPage);
        this.setCurrentPage(newPage);
    };

    onLeftArrowClick (){
        if (this.visiblePages[0] <= 1) return;
        this.visiblePages = this.visiblePages.map(p => p - 1);
        this.updateButtonStates();
    };

    onRightArrowClick() {
        if (this.visiblePages[this.visiblePages.length - 1] >= this.pageCount) return;
        this.visiblePages = this.visiblePages.map(p => p + 1);
        this.updateButtonStates();
    }


    getState() {
        return {
            currentPage: this.currentPage,
            visiblePages: this.visiblePages,
            buttonStates: this.buttonStates
        };
    }
};