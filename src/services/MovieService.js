export default class MovieService {
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWU0MjdiMGJkZTk1MWYwMzU5Y2NiMjQ1NjNhY2ZlZCIsInN1YiI6IjY0ZmIyNTBhYTM1YzhlMDExY2Y1MTgzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xan5JB9xczw1D2P5V3MdYeSs5FPoQU4StZWLvsPpjro',
    },
  };

  _apiBase = 'https://api.themoviedb.org/3';

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`, this.options);

    if (!res.ok) {
      throw new Error(`Could not fetch ${this._apiBase}${url}, recieved ${res.status}`);
    }

    return res.json();
  }

  async getPopularMovies(page) {
    const body = await this.getResource(`/movie/popular?language=en-US&page=${page}`);
    return body.results;
  }

  async searchMovies(page, text) {
    const body = await this.getResource(`/search/movie?query=${text}&include_adult=false&language=en-US&page=${page}`);
    return body.results;
  }

  async getCountPopular() {
    const body = await this.getResource('/movie/popular?language=en-US&page=1');
    return body.total_pages;
  }

  async getCountSearch(page, text) {
    const body = await this.getResource(`/search/movie?query=${text}&include_adult=false&language=en-US&page=${page}`);
    return body.total_pages;
  }
}
