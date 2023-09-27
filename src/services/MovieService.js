export default class MovieService {
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
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
    const body = await this.getResource(`/authentication/guest_session/new?api_key=${this._apiKey}`);
    return body.guest_session_id;
  }

  async getPopularMovies(page = 1) {
    const body = await this.getResource(`${this.urlPopular}&page=${page}&api_key=${this._apiKey}`);
    return body;
  }

  async searchMovies(page, text) {
    const body = await this.getResource(`${this.urlSearch}&query=${text}&page=${page}&api_key=${this._apiKey}`);
    return body;
  }

  async getGenres() {
    const body = await this.getResource(`/genre/movie/list?language=en&api_key=${this._apiKey}`);
    return body.genres;
  }

  async addRateMovie(sessionId, id, rating) {
    const postOptions = {
      method: 'POST',
      headers: { accept: 'application/json', 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ value: rating }),
    };
    const url = `${this._apiBase}/movie/${id}/rating?guest_session_id=${sessionId}&api_key=${this._apiKey}`;

    const res = await fetch(url, postOptions);

    if (!res.ok) {
      throw new Error(`Could not fetch ${this._apiBase}${url}, recieved ${res.status}`);
    }
  }

  async getRatedMovies(sessionId, page = 1) {
    const body = await this.getResource(
      `/guest_session/${sessionId}/rated/movies?api_key=${this._apiKey}&page=${page}`
    );
    return body;
  }
}
