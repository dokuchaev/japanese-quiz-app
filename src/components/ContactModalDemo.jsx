import React, { useState } from 'react';
import '../ContactModal.css';

const ContactModalDemo = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Демо-режим: симулируем отправку
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Показываем данные в консоли для демонстрации
      console.log('📧 Демо-отправка email:');
      console.log('От:', email);
      console.log('Сообщение:', message);
      console.log('Кому: dmitry.nsaa@gmail.com');
      
      setSubmitStatus('success');
      setEmail('');
      setMessage('');
      
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Demo Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h2>Для предложений (Демо)</h2>
          <button className="contact-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div style={{ padding: '16px 24px', backgroundColor: '#fef3c7', borderBottom: '1px solid #f59e0b', color: '#92400e' }}>
          <strong>⚠️ Демо-режим:</strong> Данные будут показаны в консоли браузера. Для реальной отправки настройте Formspree или EmailJS.
        </div>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш email"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Сообщение *</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ваше сообщение"
              rows="5"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {submitStatus === 'success' && (
            <div className="submit-success">
              ✅ Демо-отправка успешна! Данные показаны в консоли браузера (F12 → Console).
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="submit-error">
              Произошла ошибка при отправке. Попробуйте еще раз.
            </div>
          )}
          
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !email.trim() || !message.trim()}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить (Демо)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModalDemo;






