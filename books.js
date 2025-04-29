const bookSection = document.querySelector('.books');
const coverUrl = "https://covers.openlibrary.org/";
const baseUrl = "https://openlibrary.org/";

export const fetchBooks = async (params) =>{
    try{
        const result = await fetch(baseUrl+ 'search.json?'+params);
        if(!result.ok){
            console.log('Error fetching data!');
            return null;
        }
        return result.json();
    }catch(e){
        console.log(e);
        return null;
    }

}
export const displayBooks = (books) => {
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
        else src='./images/default.jpg'


        bookCard.innerHTML = `
    <img class="shadow" src=${src} alt="${book.title} cover" class="book-cover">
    <h3>${book.title}</h3>
     <p class="authors">${book.author_name? book.author_name.join(', '): 'unknown'}</p>
    `
        bookSection.appendChild(bookCard);

})

}



