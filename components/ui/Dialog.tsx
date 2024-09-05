// src/components/ui/Dialog.tsx

import React, { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => (
  <div className={`dialog ${open ? 'open' : 'closed'}`}>
    {React.Children.map(children, child => 
      React.isValidElement(child) ? React.cloneElement(child, { onOpenChange }) : null
    )}
  </div>
);

interface DialogTriggerProps {
  children: ReactNode;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => (
  <div>
    {React.cloneElement(children as React.ReactElement, { onClick: () => onOpenChange(true) })}
  </div>
);

export const DialogContent: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="dialog-content">
    {children}
  </div>
);

export const DialogHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="dialog-header">
    {children}
  </div>
);

export const DialogTitle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h3>{children}</h3>
);
