const baseUrl = "https://openlibrary.org/";
const searchParams = new URLSearchParams();
const coverUrl = "https://covers.openlibrary.org/";

let currentPage = 1;
const booksPerPage = 10;

const fetchBooks = async ()=>{
    try{
        const result = await fetch(baseUrl+ 'search.json?'+searchParams);
        if(!result.ok){
            console.log('Error fetching data!');
            return;
        }
        return result.json();
    }catch(e){
        console.log(e);
    }

}

const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const sort = document.getElementById('sort');
const searchButtons = document.querySelectorAll('.search-button');

searchButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (index === 0) {
            if (titleInput.value) searchParams.set('title', titleInput.value);
            else searchParams.delete('title');
        } else if (index === 1) {
            if (authorInput.value) searchParams.set('author', authorInput.value);
            else searchParams.delete('author');
        fetchBooks().then(displayBooks)
    }});
});

sort.addEventListener('change', (e) => {
    searchParams.set('sort', e.target.value);
    fetchBooks().then(displayBooks)

});


const displayBooks = (data)=>{
    if(!data || ! data.docs){
        console.log("No books found");
        return;
    }
    const books = data.docs;
    const bookSection = document.querySelector('.books');
    bookSection.innerHTML = '';
    if (books.length === 0) {
        bookSection.innerHTML = '<p class="no-results">No books found matching your criteria</p>';
        return;
    }
    books.forEach(book =>{
        const bookCard = document.createElement('div');
        bookCard.className = 'bookCard';

        let src = '';
        if (book.cover_i)src =`${coverUrl}b/id/${book.cover_i}-M.jpg`;


        bookCard.innerHTML = `
        <img src=${src} alt="${book.title} cover" class="book-cover">
        <h3>${book.title}</h3>
         <p>${book.author_name? book.author_name.join(','): 'unknown'}</p>
        `
        bookSection.appendChild(bookCard);

    })

}

window.addEventListener('load', ()=>{
    console.log('loaded')
    searchParams.set('q', '*');
    searchParams.set('limit', '10')
    fetchBooks().then(displayBooks);

})

