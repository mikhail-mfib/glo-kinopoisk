const searchForm = document.querySelector('#search-from');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500/';

function apiSearch(evt) {
    evt.preventDefault();
    const searchText = document.querySelector('#search-text').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=7e7bfe7b37b3f3198e3dcb737f5ead6d&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка';

    fetch(server)
        .then(function(value){
            if(value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function(output){

            let inner = '';
            output.results.forEach(function (item){
            let nameItem = item.name || item.title;
            let dateItem = '';
            let posterPicture = '';
            if (item.first_air_date || item.release_date) {
                dateItem = item.release_date || item.first_air_date;
            } else {dateItem = 'Дата не указана'}

            if (item.poster_path) {
                posterPicture = urlPoster + item.poster_path;
            } else {posterPicture = 'img/noimg.png'}
            inner += `
            <div class="col-12 col-md-4 col-xl-3  item">
                <img src="${posterPicture}" alt="${nameItem}"></img>
                <h5>${nameItem}</h5>
                <h6>${dateItem}</h6>
            </div>
            
            `;       
            });

            movie.innerHTML = inner;
        })

        .catch(function(reason){
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.error('error ' + reason.status);
        });
}

searchForm.addEventListener('submit', apiSearch);
