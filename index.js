import {displayBooks, fetchBooks} from "./books.js";
import {Pagination} from "./pagination.js";

const perPage = 20;
const searchParams = new URLSearchParams();
searchParams.set('limit', '20');

const currentYear = new Date().getFullYear().toString();

const PAGINATION = new Pagination(1, perPage, 100);

const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const sort = document.getElementById('sort');
const searchButtons = document.querySelectorAll('.search-button');
const subject = document.getElementById('subject');
const year = document.getElementById('year');
const pages = document.querySelector('.pages');
const caretButtons = document.querySelectorAll('.caret');

year.setAttribute('max', currentYear)
const footer = document.querySelector('footer p')
footer.innerHTML+= " " + currentYear;


searchButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (index === 0) {
            if (titleInput.value) searchParams.set('title', titleInput.value);
            else searchParams.delete('title');
        } else if (index === 1) {
            if (authorInput.value) searchParams.set('author', authorInput.value);
            else searchParams.delete('author');

        }else if (index === 2){
            if(year.value)searchParams.set('first_publish_year', year.value)
            else searchParams.delete('first_publish_year')
        }
        resetPage();
    });
});

sort.addEventListener('change', (e) => {
    searchParams.set('sort', e.target.value);
    resetPage();
});

subject.addEventListener('change', (e)=>{
    if (e.target.value)searchParams.set('subject', e.target.value);
    else searchParams.delete('subject');
    resetPage();

})

const search = ()=>{
    const offset = (PAGINATION.currentPage - 1)*perPage;
    searchParams.set('offset', offset.toString());

   fetchBooks(searchParams).then(data => {
        if(!data || !data.docs || !data.num_found){
            console.log("No books found");
            return;
        }
        PAGINATION.setPageCount(data.num_found, perPage);
       renderPageButtons();
       displayBooks(data.docs);

    })

}

const resetPage = () => {
    PAGINATION.changePage(1);
    search();
}

const renderPageButtons= ()=> {
    const visiblePages = PAGINATION.visiblePages;
    const currentPage = PAGINATION.currentPage;
    const buttonStates = PAGINATION.buttonStates;

    pages.innerHTML = '';
    visiblePages.forEach(page=>{
        const pageButton = document.createElement('button');
        pageButton.classList.add('page-button');
        if(page === currentPage)pageButton.classList.add('active');
        pageButton.textContent = page;
        pages.appendChild(pageButton);
    })

    caretButtons[0].disabled = !buttonStates.leftArrow;
    caretButtons[1].disabled = !buttonStates.rightArrow;
}

pages.addEventListener('click', (e)=>{

    if(e.target.classList.contains('page-button')){
        document.querySelectorAll('.page-button.active').forEach(button => {
            button.classList.remove('active');
        });
        e.target.classList.add('active');
        const pageNum = parseInt(e.target.textContent);
        PAGINATION.changePage(pageNum);
        search();
    }
})

caretButtons[0].addEventListener('click', ()=>{
    if(caretButtons[0].disabled)return;
    PAGINATION.onLeftArrowClick();
    renderPageButtons();
    search();
})

caretButtons[1].addEventListener('click', () => {
    if (caretButtons[1].disabled)return;
    PAGINATION.onRightArrowClick();
    renderPageButtons();
    search();
});

window.addEventListener('load', ()=>{
    searchParams.set('subject', 'fiction');
    search();
})

