import { setToken } from '../utils/token';

export const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(res => {
    if (res.status === 400) {
      console.log('Некорректно заполнено одно из полей при регистрации')
    }
    if (res.status !== 200 && res.status !== 201) {
      console.log(res.status);
    } else {
      return res.json();
    }
  })
  .catch(err => console.log(err))
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(res => {
    if (res.status === 400) {
      console.log('Не передано одно из полей для проверки пользователя');
    }
    if (res.status === 401) {
      console.log('Пользоватль с таким email не найден');
    }
    if (res.status !== 200 && res.status !== 201) {
      console.log(res.status);
    } else {
      return res.json();
    }
  })
  .then((data) => {
    if (data.token){
      setToken(data.token);
      return data;
    } else {
      return;
    }
  })
  .catch(err => console.log(err))
};

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => {
    if (res.status === 401) {
      console.log('Некорректная отправка токена')
    }
    return res.json();
  })
  .then((data) => {
      return data;
  })
  .catch(err => console.log(err))
}
