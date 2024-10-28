import React, { useState, useEffect } from 'react';
import axios from '../pages/axiosConfig';
import { useNavigate } from 'react-router-dom'; // Для перенаправления

const ReportForm = () => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState(null); // Для хранения загруженного изображения
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Статус авторизации
  const [isAdminUser, setAdminUser] = useState(false); // Статус админа
  const navigate = useNavigate(); // Для перенаправления

  // Проверяем, авторизован ли пользователь и является ли он администратором
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Если токен есть, пользователь авторизован
      // Запрашиваем информацию о пользователе
      axios.get('http://localhost:8000/api/users/me/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setAdminUser(response.data.is_staff); // Устанавливаем, является ли пользователь администратором
      })
      .catch((error) => {
        console.error('Ошибка при проверке статуса администратора:', error);
      });
    } else {
      navigate('/login'); // Если токена нет, перенаправляем на страницу входа
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!navigator.geolocation) {
      setError('Geolocation не поддерживается вашим браузером.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const location = response.data;
        const street = location.address.road || 'Неизвестная улица';
        const city = location.address.city || location.address.town || location.address.village || 'Неизвестный город';

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('description', description);
        formData.append('location', `${street}, ${city}`);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        if (image) {
          formData.append('image', image);
        }

        const complaintResponse = await axios.post('http://localhost:8000/api/users/complaints/create/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        });

        setSuccess(true);
        setDescription('');
        setImage(null);
      } catch (error) {
        setError(error.response.data.detail || 'Ошибка отправки жалобы.');
      }
    }, (error) => {
      setError('Не удалось получить ваше местоположение.');
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Функция для выхода из аккаунта
  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен из localStorage
    setIsAuthenticated(false); // Обновляем статус авторизации
    navigate('/login'); // Перенаправляем на страницу входа
  };

  // Функция для перехода на страницу профиля или панели администратора
  const handleProfileOrAdmin = () => {
    if (isAdminUser) {
      navigate('/admin'); // Перенаправляем на панель администратора
    } else {
      navigate('/profile'); // Перенаправляем на страницу профиля
    }
  };

  return (
    <div>
      <header className="bg-primary text-white text-center py-3">
        <h1 className="display-4">Отправить жалобу</h1>
        <p className="lead">Опишите проблему и прикрепите фото</p>
        {isAuthenticated && (
          <div>
            <button className="btn btn-danger mt-2" onClick={handleLogout}>
              Выйти
            </button>
            <button
              className="btn btn-secondary mt-2 mx-2"
              onClick={handleProfileOrAdmin}
            >
              {isAdminUser ? 'Панель администратора' : 'Профиль'}
            </button>
          </div>
        )}
      </header>

      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Категория проблемы</label>
                <select className="form-select" id="category">
                  <option defaultValue>Выберите категорию</option>
                  <option value="1">Нарушение порядка</option>
                  <option value="2">Засорение улиц</option>
                  <option value="3">Повреждение имущества</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Описание</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="3"
                  placeholder="Опишите проблему"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="photo" className="form-label">Прикрепить фото</label>
                <input
                  type="file"
                  className="form-control"
                  id="photo"
                  onChange={handleImageChange}
                />
              </div>
              <button type="submit" className="btn btn-success w-100">Отправить жалобу</button>
              {error && <div className="text-danger mt-2">{error}</div>}
              {success && <div className="text-success mt-2">Жалоба успешно отправлена!</div>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportForm;
