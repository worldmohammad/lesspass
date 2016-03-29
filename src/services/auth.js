import { polyfill } from 'es6-promise';
polyfill();
import 'isomorphic-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

export default {
  user: {
    authenticated: false,
  },

  login(credential) {
    return fetch('/api/sessions/', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credential),
    }).then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        localStorage.setItem('token', data.token);
        this.user.authenticated = true;
        return data;
      });
  },

  logout() {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem('token');
        this.user.authenticated = false;
        resolve();
      } catch (e) {
        reject('cannot logout');
      }
    });
  },

  checkAuth() {
    const jwt = localStorage.getItem('token');
    this.user.authenticated = !!jwt;
  },
};
