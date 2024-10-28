import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import ComplaintButton from '../components/ComplaintButton';

const Home = () => {
  const navigate = useNavigate(); // Инициализируем navigate

  useEffect(() => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    if (token) {
      navigate('/report'); // Если токен существует, перенаправляем на страницу репорта
    }
  }, [navigate]); // Добавляем navigate в зависимости

  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white text-center py-4">
        <h1 className="display-4">Taza Dala</h1>
        <p className="lead">Платформа для отправки жалоб в отдел работников государства</p>
      </header>

      {/* Main Body */}
      <main className="container-fluid my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 text-center">
            <h2>Добро пожаловать!</h2>
            <p className="lead">
              Здесь вы можете отправить жалобу о нарушении общественного порядка. Просто нажмите на кнопку ниже, чтобы зарегистрироваться и начать.
            </p>
            <ComplaintButton />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
