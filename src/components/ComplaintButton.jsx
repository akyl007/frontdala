import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ComplaintButton = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleLogin = () => {
    navigate('/login');
    handleClose();
  };

  const handleRegister = () => {
    navigate('/register');
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Отправить жалобу
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Выбор действия</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы уже зарегистрированы? Выберите одно из следующих действий:</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogin}>
            Войти
          </Button>
          <Button variant="primary" onClick={handleRegister}>
            Зарегистрироваться
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ComplaintButton;
