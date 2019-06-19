const searchForm = document.querySelector('#search-from');
const movie = document.querySelector('#movies');

function apiSearch(evt) {
    evt.preventDefault();
    const searchText = document.querySelector('#search-text').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=7e7bfe7b37b3f3198e3dcb737f5ead6d&language=ru&query=' + searchText;
    
    
    requestApi(server).then(function(result) {
            const output = JSON.parse(result);
            let inner = '';
            output.results.forEach(function (item){
            let nameItem = item.name || item.title;
            let dateItem = '';
            if (item.first_air_date || item.release_date) {
                dateItem = item.release_date || item.first_air_date;
            } else {dateItem = 'Дата не указана'}

            inner += `<div class="col-6"><h4>${nameItem}</h4><h6>${dateItem}</h6></div>`;       
        });

        movie.innerHTML = inner;

        })
        .catch(function(reason){
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.log('error ' + request.status);
        });
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    return new Promise (function(resolve, reject) {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.addEventListener('load', function() {
            if (reject.status !== 200) {
                reject({status: request.status});
                return;
            } 

            resolve(request.response);
        });
        request.addEventListener('error', function() {
            reject({status: request.status});
        });
        request.send();
    })
    
    
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) {
            movie.innerHTML = 'Загрузка';
            return
        };

        if (request.status !== 200) {
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.log('error ' + request.status);
            return;
        }

        const output = JSON.parse(request.responseText);
        
    });
}