import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { DatabaseOutlined, ApiOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Switch from './basicUI/switch';
import './App.scss';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<string>('fakeData');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    // Update body class when theme changes
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (path === 'fake-data') setCurrentTab('fakeData');
    if (path === 'api-data') setCurrentTab('apiData');
  }, [location]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const menuItems: MenuProps['items'] = [
    {
      label: 'Fake Data',
      key: 'fakeData',
      icon: <DatabaseOutlined />,
    },
    {
      label: 'API Data',
      key: 'apiData',
      icon: <ApiOutlined />,
    },
    {
      label: <Switch checked={isDarkMode} onChange={handleThemeToggle} />,
      key: 'themeToggle',
      style: { marginLeft: 'auto', marginTop: '2px' },
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key !== 'themeToggle') {
      setCurrentTab(e.key);
      navigate(e.key === 'fakeData' ? '/fake-data' : '/api-data');
    }
  };

  return (
    <div>
      <header>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="horizontal"
          selectedKeys={[currentTab]}
          items={menuItems}
          onClick={handleMenuClick}
          className="navigation-menu"
        />
      </header>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default App;