"use strict";

const axios = require(`axios`);
const {HttpMethod} = require(`./../constants.js`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {comments, offset, limit}});
  }

  async getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  async getArticlesByCategoryId({offset, limit, id}) {
    return this._load(`/articles/categories/${id}`, {
      params: {
        offset,
        limit,
      },
    });
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return await this._load(`/category`, {params: {count}});
  }

  async createCategory(data) {
    return await this._load(`/category`, {
      method: HttpMethod.POST,
      data,
    });
  }

  async updateCategory({name, id}) {
    return await this._load(`/category/${id}`, {
      method: HttpMethod.PUT,
      data: {name},
    });
  }

  async deleteCategory({id}) {
    return await this._load(`/category/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: HttpMethod.POST,
      data,
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data,
    });
  }

  deleteArticle({id}) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data,
    });
  }

  deleteComment({id}) {
    return this._load(`/comments/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  async getComments({order, limit, includeUser}) {
    return this._load(`/comments`, {
      data: {order, limit, includeUser},
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data,
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password},
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
