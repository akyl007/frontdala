import React, { useState } from 'react';
import axios from '../pages/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка совпадения паролей
    if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
    }

    try {
        // Регистрация пользователя
        const response = await axios.post('http://localhost:8000/api/users/register/', {
            username,
            email,
            password,
        });

        setSuccess(true);
        setError(null);
        console.log('Пользователь успешно зарегистрирован:', response.data);

        // Автоматический вход после регистрации
        try {
            const loginResponse = await axios.post('http://localhost:8000/api/users/login/', {
                email: email,
                password: password,
            });

            // Сохранение токена в localStorage
            const { token } = loginResponse.data;
            localStorage.setItem('token', token);
            console.log('Токен сохранен:', token);

            // Перенаправление на страницу жалоб
            navigate('/report');
        } catch (loginError) {
            console.error('Ошибка при автоматическом входе:', loginError.response ? loginError.response.data : loginError.message);
            setError('Не удалось выполнить автоматический вход. Пожалуйста, войдите вручную.');
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data.detail : 'Произошла ошибка при регистрации');
    }
};

  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white text-center py-4">
        <h1 className="display-4">Регистрация</h1>
        <p className="lead">Создайте аккаунт, чтобы отправлять жалобы</p>
      </header>

      {/* Main Body */}
      <main className="container-fluid my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Имя пользователя</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">Зарегистрироваться</button>
              {error && <div className="text-danger mt-2">{error}</div>}
              {success && <div className="text-success mt-2">Пользователь успешно зарегистрирован!</div>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
