// src/components/ui/Tabs.tsx

import React, { ReactNode, useState } from 'react';

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (React.isValidElement(child) && child.type === TabsContent) {
          return activeTab === child.props.value ? child : null;
        }
        return null;
      })}
    </div>
  );
};

interface TabsListProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ activeTab, setActiveTab, children }) => (
  <div className="tabs-list">
    {React.Children.map(children, child =>
      React.isValidElement(child) ? React.cloneElement(child, { activeTab, setActiveTab }) : null
    )}
  </div>
);

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, activeTab, setActiveTab }) => (
  <button
    className={`tabs-trigger ${activeTab === value ? 'active' : ''}`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => (
  <div className={`tabs-content ${value}`}>
    {children}
  </div>
);
