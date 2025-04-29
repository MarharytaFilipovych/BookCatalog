const bookSection = document.querySelector('.books');
const coverUrl = "https://covers.openlibrary.org/";
const baseUrl = "https://openlibrary.org";
const descriptionBlock = document.getElementById("description");
const error = document.getElementById('error');
const noResultsMessage = document.getElementById('no-results');

const fetchData  = async (url)=>{
    error.style.visibility = 'hidden';
    try{
        const result = await fetch(url);
        if(!result.ok){
            console.log('Error fetching data!');
            error.style.visibility = 'visible';
            return null;
        }
        return result.json();
    }catch(e){
        error.style.visibility = 'visible';
        console.log(e);
        return null;
    }
}

export const fetchBooks = async (params) =>{
   return await fetchData (baseUrl + '/search.json?' + params);

}

export const fetchDetails = async (key)=>{
    const result = await fetchData (baseUrl + key + '.json');
    if(!result) return null;
    return {
        subjects: result.subjects ? result.subjects.slice(0, 5).map(s => s.toLowerCase()).join(', ') : 'unknown',
        date: result.first_publish_date ?? 'unknown date',
        description: result.description.value  ?? 'without description',
        title: result.title
    }
}

const fillDescriptionBlock = async (key, authors, editionCount)=>{
    error.style.visibility = 'hidden';
    const details = await fetchDetails (key);
    if (!details) {
        error.style.visibility = 'visible';
        return;
    }
    document.getElementById('description-text').innerHTML = `
            <article class="book-description">
              <h2>${details.title}</h2>
              <p>This book was written by ${authors} on <strong>${details.first_publish_date}</strong>. There are <strong>${editionCount}</strong> editions.</p>
              <p><strong>Subjects</strong>: ${details.subjects}</p>
              <p>${details.description}</p>
            </article>`;
    descriptionBlock.style.display = 'block';
}


export const displayBooks = async (data) => {
    bookSection.innerHTML = '';
    noResultsMessage.style.display = 'none';
    if (!data || !data.docs || !data.num_found || data.docs.length === 0) {
        noResultsMessage.style.display = 'block';
        return;
    }
    const books = data.docs;
    books.forEach(book =>  {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        let src;
        if (book.cover_i)src =`${coverUrl}b/id/${book.cover_i}-M.jpg`;
        else src='./images/default.jpg'

        const authors = book.author_name? book.author_name.join(', '): 'unknown'
        bookCard.innerHTML = `
            <img class="shadow" src="${src}" alt="${book.title} cover" class="book-cover">
            <h3 class="book-title">${book.title}</h3>
            <p class="authors">${authors}</p>
        `;

        bookSection.appendChild(bookCard);
        bookCard.addEventListener('click', async ()=>{
           await fillDescriptionBlock(book.key, authors, book.edition_count);
        })
    })
    document.getElementById('cross').addEventListener('click', () => {
        descriptionBlock.style.display = 'none';
    });
}



