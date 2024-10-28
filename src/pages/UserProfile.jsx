import React, { useEffect, useState } from 'react';
import axios from '../pages/axiosConfig';
import { useNavigate } from 'react-router-dom'; 

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Статус авторизации
  const navigate = useNavigate();

  // Проверяем, авторизован ли пользователь
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Если токен есть, пользователь авторизован
    } else {
      navigate('/login'); // Если токена нет, перенаправляем на страницу входа
    }
  }, [navigate]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/users/me/', {
          headers: { Authorization: `Token ${token}` },
        });
        setProfileData(response.data);
      } catch (error) {
        setError('Ошибка загрузки профиля');
      }
    };

    const fetchUserComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/users/me/complaints/', {
          headers: { Authorization: `Token ${token}` },
        });
        setComplaints(response.data);
      } catch (error) {
        setError('Ошибка загрузки жалоб');
      }
    };

    fetchUserProfile();
    fetchUserComplaints();
  }, []);
// Функция для выхода из аккаунта
const handleLogout = () => {
  localStorage.removeItem('token'); // Удаляем токен из localStorage
  setIsAuthenticated(false); // Обновляем статус авторизации
  navigate('/login'); // Перенаправляем на страницу входа
};

// Функция для перехода на страницу профиля
const handleProfile = () => {
  navigate('/report'); // Перенаправляем на страницу профиля
};
  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white text-center py-4">
        <h1 className="display-4">Профиль пользователя</h1>
        <p className="lead">Просмотр ваших заявок и жалоб</p>
        {isAuthenticated && (
          <div>
            <button className="btn btn-danger mt-2" onClick={handleLogout}>
              Выйти
            </button>
            <button className="btn btn-secondary mt-2 mx-2" onClick={handleProfile}>
              Создать жалобу
            </button>
          </div>
        )}
      </header>

      <div className="container my-5">
        {profileData ? (
          <div className="mb-5">
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Имя:</strong> {profileData.username}</p>
          </div>
        ) : (
          <p>Загрузка профиля...</p>
        )}

        <h2 className="my-4">История жалоб</h2>
        {complaints.length > 0 ? (
          <div className="row">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm">
                  {complaint.image && (
                    <img
                      src={complaint.image.startsWith('http') ? complaint.image : `http://localhost:8000/media/${complaint.image}`}
                      alt="Изображение жалобы"
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '150px', width: '100%' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">Жалоба #{complaint.id}</h5>
                    <p className="card-text"><strong>Описание:</strong> {complaint.description}</p>
                    <p className="card-text"><strong>Местоположение:</strong> {complaint.location}</p>
                    <p className="card-text">
                      <strong>Статус:</strong>
                      <span
                        className={
                          complaint.status === 'На проверке'
                            ? 'status-pending'
                            : complaint.status === 'В процессе'
                            ? 'status-in-progress'
                            : complaint.status === 'Решено'
                            ? 'status-resolved'
                            : ''
                        }
                      >
                        {complaint.status}
                      </span>
                    </p>
                    <p className="card-text"><small className="text-muted">Дата создания: {new Date(complaint.created_at).toLocaleDateString()}</small></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Жалоб нет.</p>
        )}

        {error && <p className="text-danger">{error}</p>}
      </div>

      {/* Footer */}
      <footer className="bg-light text-center py-4">
        <p className="mb-0">© 2024 Taza Dala. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default UserProfile;
