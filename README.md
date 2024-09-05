
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdvancedTextEditor } from './AdvancedTextEditor';
import './styles.css';  // Import CSS here

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<AdvancedTextEditor />);
}
