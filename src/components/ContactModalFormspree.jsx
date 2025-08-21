import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import '../ContactModal.css';

const ContactModalFormspree = ({ isOpen, onClose }) => {
  const [state, handleSubmit] = useForm("mzzvqlgn");
  
  // Закрываем модальное окно после успешной отправки
  React.useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded, onClose]);
  
  const handleFormSubmit = (e) => {
    handleSubmit(e);
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h2>Для предложений</h2>
          <button
            className="contact-modal-close"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            ×
          </button>
        </div>
        

        
        <form onSubmit={handleFormSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Ваш email"
              required
              disabled={state.submitting}
            />
            <ValidationError 
              prefix="Email" 
              field="email"
              errors={state.errors}
              className="validation-error"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Сообщение *</label>
            <textarea
              name="message"
              id="message"
              placeholder="Ваше сообщение"
              rows="5"
              required
              disabled={state.submitting}
            />
            <ValidationError 
              prefix="Сообщение" 
              field="message"
              errors={state.errors}
              className="validation-error"
            />
          </div>
          
          {state.succeeded && (
            <div className="submit-success">
              Сообщение отправлено! Спасибо за обратную связь.
            </div>
          )}
          
          {state.errors && state.errors.length > 0 && (
            <div className="submit-error">
              Произошла ошибка при отправке. Попробуйте еще раз.
            </div>
          )}
          
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={state.submitting}
            >
              {state.submitting ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModalFormspree;
