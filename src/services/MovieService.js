export default class MovieService {
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWU0MjdiMGJkZTk1MWYwMzU5Y2NiMjQ1NjNhY2ZlZCIsInN1YiI6IjY0ZmIyNTBhYTM1YzhlMDExY2Y1MTgzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xan5JB9xczw1D2P5V3MdYeSs5FPoQU4StZWLvsPpjro',
    },
  };

  _apiKey = '95e427b0bde951f0359ccb24563acfed';

  _apiBase = 'https://api.themoviedb.org/3';

  urlPopular = '/movie/popular?language=en-US';

  urlSearch = '/search/movie?include_adult=false&language=en-US';

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`, this.options);

    if (!res.ok) {
      throw new Error(`Could not fetch ${this._apiBase}${url}, recieved ${res.status}`);
    }

    return res.json();
  }

  async createGuestSession() {
    const body = await this.getResource('/authentication/guest_session/new');
    return body.guest_session_id;
  }

  async getPopularMovies(page) {
    const body = await this.getResource(`${this.urlPopular}&page=${page}`);
    return body.results;
  }

  async getCountPopular() {
    const body = await this.getResource(`${this.urlPopular}&page=1`);
    return body.total_pages;
  }

  async searchMovies(page, text) {
    const body = await this.getResource(`${this.urlSearch}&query=${text}&page=${page}`);
    return body.results;
  }

  async getCountSearch(page, text) {
    const body = await this.getResource(`${this.urlSearch}&query=${text}&page=${page}`);
    return body.total_pages;
  }

  async getGenres() {
    const body = await this.getResource('/genre/movie/list?language=en');
    return body.genres;
  }
}
