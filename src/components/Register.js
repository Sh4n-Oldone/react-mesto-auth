import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as auth from '../utils/auth.js';

export default function Register({isError, onReg}) {
  const history = useHistory();
  const [state, setState] = useState({
    email: '',
    password: '',
    message: ''
  });
  const handleChange = (e) => {
    const { name,  value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = state;
    if (!email || !password){
      return;
    }
    auth.register(password, email)
      .then((data) => {
      
        if (!data){
          setState({message: 'Что-то пошло не так!'});
          isError(true)
        }

        setState({ email: '', password: '', message: '' });
        history.push('/sign-in');
        isError(false);
      })
      .catch(err => console.log(err));

      onReg();
  }


  return (
    <>
      <section className='login'>
        <form className='login__form'>
            <h2 className='login__title'>Регистрация</h2>
            <input 
              className='input-style__reset login__form_input login__form_email' 
              name='email' 
              value={state.email || ''}
              placeholder='Email' 
              type='email' 
              onChange={handleChange} 
              required
            ></input>
            <input 
              className='input-style__reset login__form_input login__form_password' 
              placeholder='Пароль' 
              name='password' 
              value={state.password || ''}
              type='password' 
              onChange={handleChange} 
              required
            ></input>
          <button 
            type='submit'
            className='login__form_button button-style__reset'
            onClick={handleSubmit}
          >Зарегистрироваться</button>
        </form>
        <button 
          className='login__redirect_button button-style__reset' 
          onClick={() => {history.push('./sign-in')}}
        >Уже зарегистрированы? Войти</button>
      </section>
    </>
  )
};