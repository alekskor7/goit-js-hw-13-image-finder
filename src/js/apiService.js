import axios from 'axios';
axios.defaults.params = { key: '23523272-7e7e55898992c75b8603edf48' };
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class ImageFinder {
  #query;
  #page;
  constructor() {
    this.#query = '';
    this.#page = 1;
    this.perPage = 12;
  }

  async getPhotos() {

    const validationInputValue = this.#query.trim();
    if (validationInputValue) {
      const { data } = await axios.get(
        `?image_type=photo&orientation=horizontal&q=${this.#query}&page=${this.#page}&per_page=${
          this.perPage
        }`,
      );
      this.incrementPage();
      return data;
    }
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
    this.#page = 1;
  }

  incrementPage() {
    this.#page++;
  }
}