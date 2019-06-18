const searchForm = document.querySelector('#search-from');
const movie = document.querySelector('#movies');

function apiSearch(evt) {
evt.preventDefault();
const searchText = document.querySelector('#search-text').value;
const server = 'https://api.themoviedb.org/3/search/multi?api_key=7e7bfe7b37b3f3198e3dcb737f5ead6d&language=ru&query=' + searchText;
requestApi(server)
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    const request = new XMLHttpRequest();
    
    request.open('GET', url);
    request.send();
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status !== 200) {
            console.log('error ' + request.status);
            return;
        }

        const output = JSON.parse(request.responseText);
        
        let inner = '';
        console.log(output);
        output.results.forEach(function (item){
            let nameItem = item.name || item.title;
            let dateItem = '';
            if (item.first_air_date || item.release_date) {
                dateItem = item.release_date || item.first_air_date;
            } else {dateItem = 'Дата не указана'}

            inner += `<div class="col-6"><h4>${nameItem}</h4><h6>${dateItem}</h6></div>`;       
        });

        movie.innerHTML = inner;
    });
}