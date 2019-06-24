const searchForm = document.querySelector('#search-from');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500/';

function apiSearch(evt) {
    evt.preventDefault();
    const searchText = document.querySelector('#search-text').value;

    if(searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Пустой запрос</h2>';
        return;
    }

    movie.innerHTML = '<div class="spinner"></div>';
    fetch('https://api.themoviedb.org/3/search/multi?api_key=7e7bfe7b37b3f3198e3dcb737f5ead6d&language=ru&query=' + searchText)
        .then(function(value){
            if(value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function(output){
            let inner = '<h4 class="col-12 text-center text-info">Популярные за неделю</h4>';
            if(output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>'
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let dateItem = '';
                if (item.first_air_date || item.release_date) {
                    dateItem = item.release_date || item.first_air_date;
                } else {dateItem = 'Дата не указана'}

                let posterPicture = '';
                if (item.poster_path) {
                    posterPicture = urlPoster + item.poster_path;
                } else {posterPicture = './img/noimg.png'}
                
                let dataInfo = '';
                if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" 
                data-type="${item.media_type}"`;
                inner += `
                <div class="col-12 col-md-4 col-xl-3 item">
                    <img src="${posterPicture}" class="posterPicture" alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem}</h5>
                    <h6>${dateItem}</h6>
                </div>
                `;       
            });
            movie.innerHTML = inner;
            addEventMedia();
            
        })
        .catch(function(reason){
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.error('error ' + reason.status);
        });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
            media.forEach(function(elem) {
                elem.style.cursor = 'pointer';
                elem.addEventListener('click', showFullInfo);
            });
}


function showFullInfo() {
    let url = '';
    if(this.dataset.type === 'movie') {
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=7e7bfe7b37b3f3198e3dcb737f5ead6d&language=ru';
    } else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=7e7bfe7b37b3f3198e3dcb737f5ead6d&language=ru';
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка! Повторите позже</h2>';
    }

    fetch(url)
    .then(function(value){
        if(value.status !== 200) {
            return Promise.reject(value);
        }
        return value.json();
    })
    .then(function(output){
        console.log(output);
        let movieGenres = ''; 
        output.genres.forEach(function(item) {
            movieGenres += item.name + ' ';
        })
        movie.innerHTML = `
        <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
        <div class="col-4">
            <img src="${urlPoster + output.poster_path}" alt="${output.name || output.title}">
            ${(output.homepage) ? `<p class="text-center"> <a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
            ${(output.imdb_id) ? `<p class="text-center">
                <a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com</a>
            </p>` : ''}
        </div>
        <div class="col-8">
            <p class="">Рейтинг: ${output.vote_average}</p>
            <p class="">Статус: ${output.status}</p>
            <p class="">Дата выхода: ${output.first_air_date || output.release_date}</p>

            ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезон: ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}

            <p>Описание: ${output.overview}</p>
            <p>Жанры: ${movieGenres}</p>
        </div>
        `;
    })
    .catch(function(reason){
        movie.innerHTML = 'Упс, что-то пошло не так';
        console.error('error ' + reason.status);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=7e7bfe7b37b3f3198e3dcb737f5ead6d&language=ru')
        .then(function(value){
            if(value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function(output){
            let inner = '<h4 class="col-12 text-center text-info">Популярные за неделю</h4>';
            if(output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>'
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let mediaType = item.title ? 'movie' : 'tv';
                let dateItem = '';
                if (item.first_air_date || item.release_date) {
                    dateItem = item.release_date || item.first_air_date;
                } else {dateItem = 'Дата не указана'}

                let posterPicture = '';
                if (item.poster_path) {
                    posterPicture = urlPoster + item.poster_path;
                } else {posterPicture = './img/noimg.png'}
                
                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
                inner += `
                <div class="col-12 col-md-4 col-xl-3 item">
                    <img src="${posterPicture}" class="posterPicture" alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem}</h5>
                    <h6>${dateItem}</h6>
                </div>
                `;       
            });
            movie.innerHTML = inner;
            addEventMedia();
            
        })
        .catch(function(reason){
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.error('error ' + reason.status);
        });
});