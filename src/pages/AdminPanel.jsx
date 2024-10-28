import React, { useEffect, useState } from 'react';
import axios from '../pages/axiosConfig';
import { useNavigate } from 'react-router-dom'; // Для перенаправления

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [isAdminUser, setAdminUser] = useState(false); // Статус админа
  const [loading, setLoading] = useState(true); // Для отображения загрузки
  const navigate = useNavigate(); // Для перенаправления

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/users/me/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        // Проверка, является ли пользователь администратором
        if (response.data.is_staff) {
          setAdminUser(true);
          fetchComplaints(); // Загружаем жалобы только если администратор
        }
      } catch (error) {
        console.error('Ошибка при проверке роли пользователя:', error);
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/users/complaints/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setComplaints(response.data);
      } catch (error) {
        setError('Ошибка загрузки жалоб');
        console.error('Ошибка при получении жалоб:', error.message);
      }
    };

    fetchAdminStatus();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/users/complaints/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setComplaints(complaints.filter(complaint => complaint.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении жалобы:', error.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/users/complaints/${id}/change/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setComplaints(
        complaints.map(complaint =>
          complaint.id === id ? { ...complaint, status: response.data.status } : complaint
        )
      );
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен из localStorage
    navigate('/login'); // Перенаправляем на страницу входа
  };

  if (loading) {
    return <p>Загрузка...</p>; // Показать загрузку, пока статус не получен
  }

  if (!isAdminUser) {
    return <p>Это страница только для администраторов. У вас нет доступа.</p>; // Если пользователь не админ
  }

  return (
    <div>
      <header className="bg-primary text-white text-center py-4">
        <h1 className="display-4">Панель администратора</h1>
        <button className="btn btn-danger mt-2" onClick={handleLogout}>
          Выйти
        </button>
        <p className="lead">Просмотр всех заявок пользователей</p>
      </header>

      <div className="container my-5">
        {error && <p className="text-danger">{error}</p>}

        <h2 className="my-4">Все заявки</h2>
        {complaints.length > 0 ? (
          <div className="row">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="col-md-4 col-lg-3 mb-4">
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
                      <strong>ID автора:</strong> {complaint.user_id} {/* ID пользователя */}
                      
                    </p>
                    <p className="card-text">
                      <strong>Статус:</strong>
                      <span
                        className={complaint.status === 'На проверке'
                          ? 'status-pending'
                          : complaint.status === 'В процессе'
                          ? 'status-in-progress'
                          : complaint.status === 'Решено'
                          ? 'status-resolved'
                          : ''}
                      >
                        {complaint.status}
                      </span>
                    </p>
                    <p className="card-text"><small className="text-muted">Дата создания: {new Date(complaint.created_at).toLocaleDateString()}</small></p>
                    <select
                      className="form-select"
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                      defaultValue={complaint.status}
                    >
                      <option value="На проверке">На проверке</option>
                      <option value="В процессе">В процессе</option>
                      <option value="Решено">Решено</option>
                    </select>
                    <button className="btn btn-danger mt-2" onClick={() => handleDelete(complaint.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Жалоб нет.</p>
        )}
      </div>

      <footer className="bg-light text-center py-4">
        <p className="mb-0">© 2024 Taza Dala. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default AdminPanel;
