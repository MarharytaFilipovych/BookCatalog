import {displayBooks, fetchBooks} from "./books.js";
import {Pagination} from "./pagination.js";

let perPage = 20;
let searchParams = new URLSearchParams();
const PAGINATION = new Pagination(1, perPage, 100);
let pageToFetch = 1;

const pagination = document.getElementById('pagination')
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const sort = document.getElementById('sort');
const subject = document.getElementById('subject');
const year = document.getElementById('year');
const pages = document.querySelector('.pages');
const caretButtons = document.querySelectorAll('.caret');
const loading = document.getElementById('loading');
const footer = document.querySelector('footer p')
const showMoreButton = document.getElementById('show-more');
const currentYear = new Date().getFullYear().toString();
year.setAttribute('max', currentYear)
footer.innerHTML+= " " + currentYear;

const updateFormValues = () => {
    if (searchParams.has('title')) titleInput.value = searchParams.get('title');
    if (searchParams.has('author')) authorInput.value = searchParams.get('author');
    if (searchParams.has('first_publish_year')) year.value = searchParams.get('first_publish_year');
    if (searchParams.has('sort')) sort.value = searchParams.get('sort');
    if (searchParams.has('subject'))subject.value = searchParams.get('subject');
};

const search = ()=>{
    searchParams.set('limit', perPage.toString());
    if(pageToFetch === PAGINATION.currentPage)searchParams.set('offset', ((pageToFetch - 1)*perPage).toString());
    loading.style.visibility = 'visible';
    localStorage.setItem('searchParams', searchParams.toString());
    fetchBooks(searchParams).then(async data => {
        await displayBooks(data);
        if(!data.num_found)pagination.style.display = 'none';
        else{
            pagination.style.display = 'flex';
            PAGINATION.setPageCount(data.num_found, perPage);
            renderPageButtons();
            showMoreButton.disabled = PAGINATION.pageCount === data.docs.length;

        }
        loading.style.visibility = 'hidden';

    })
}

const resetPage = () => {
    PAGINATION.changePage(1);
    pageToFetch = 1;
    perPage = 20;
    scrollToTop();
    search();
}

const renderPageButtons= ()=> {
    pages.innerHTML = '';
    PAGINATION.visiblePages.forEach(page=>{
        const pageButton = document.createElement('button');
        pageButton.classList.add('page-button');
        if(page === PAGINATION.currentPage)pageButton.classList.add('active');
        pageButton.textContent = page;
        pages.appendChild(pageButton);
    })
    caretButtons[0].disabled = !PAGINATION.buttonStates.leftArrow;
    caretButtons[1].disabled = !PAGINATION.buttonStates.rightArrow;
}

const scrollToTop = () =>{
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}


titleInput.addEventListener('change', () => {
    if (titleInput.value) searchParams.set('title', titleInput.value);
    else searchParams.delete('title');
    resetPage();
});

authorInput.addEventListener('change', () => {
    if (authorInput.value) searchParams.set('author', authorInput.value);
    else searchParams.delete('author');
    resetPage();
});

year.addEventListener('change', () => {
    if (year.value) searchParams.set('first_publish_year', year.value);
    else searchParams.delete('first_publish_year');
    resetPage();
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

pages.addEventListener('click', (e)=>{
    if(e.target.classList.contains('page-button')){
        document.querySelectorAll('.page-button.active').forEach(button => {
            button.classList.remove('active');
        });
        e.target.classList.add('active');
        const pageNum = parseInt(e.target.textContent);
        PAGINATION.changePage(pageNum);
        pageToFetch = pageNum;
        perPage = 20;
        scrollToTop();
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

showMoreButton.addEventListener('click', ()=>{
    pageToFetch++;
    perPage+=20;
    search();
})

window.addEventListener('load', ()=>{
    const savedParams = localStorage.getItem('searchParams');
    if (savedParams) {
        searchParams = new URLSearchParams(savedParams);
        updateFormValues();
    }
    if (!searchParams.has('subject')){
        searchParams.set('subject', 'fiction');
        subject.value = 'fiction';
    }
    search();
})

