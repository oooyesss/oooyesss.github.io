// src/components/ui/Button.tsx

import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick} className="btn">
    {children}
  </button>
);
