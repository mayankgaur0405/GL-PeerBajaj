import React, { createContext, useContext, useState } from 'react';

const CreatePostContext = createContext(null);

export function CreatePostProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <CreatePostContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </CreatePostContext.Provider>
  );
}

export function useCreatePost() {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error('useCreatePost must be used within a CreatePostProvider');
  }
  return context;
}





