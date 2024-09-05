// src/components/ui/Textarea.tsx

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = (props) => (
  <textarea {...props} className="textarea" />
);
