import React, { useState } from 'react';
import axios from '../pages/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Данные для входа:', { email, password }); 
    try {
        const response = await axios.post('http://localhost:8000/api/users/login/', {
            email: email,  
            password: password,
        });
        console.log(response.data);
        
        // Сохраняем токен в localStorage
        const { token } = response.data; // API возвращает токен
        localStorage.setItem('token', token); // Сохраняем токен в localStorage
        console.log('Токен сохранен:', token);
        
        // Перенаправляем пользователя на страницу отправки жалобы
        navigate('/report');
    } catch (error) {
        console.error('Ошибка входа:', error.response.data);
        setError(error.response.data.detail);  
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white text-center py-3">
        <h1 className="display-4">Вход</h1>
        <p className="lead">Пожалуйста, войдите, чтобы продолжить</p>
      </header>

      {/* Main Body */}
      <main className="container-fluid my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Введите ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Пароль</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Введите ваш пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <a href="http://localhost:5173/register" >Нет аккаунта? Зарегистрируйтесь!</a>
              <button type="submit" className="btn btn-primary w-100">Войти</button>
              {error && <div className="text-danger mt-2">{error}</div>}
              {success && <div className="text-success mt-2">Пользователь успешно вошел!</div>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
