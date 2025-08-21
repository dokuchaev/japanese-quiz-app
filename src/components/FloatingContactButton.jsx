import React, { useState } from 'react';
import ContactModalFormspree from './ContactModalFormspree';
import './FloatingContactButton.css';

const FloatingContactButton = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <button 
        className="floating-contact-button"
        onClick={() => setIsContactModalOpen(true)}
        title="Для предложений"
        aria-label="Обратная связь"
      >
        ✉️
      </button>
      
      <ContactModalFormspree 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

export default FloatingContactButton;






