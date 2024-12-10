import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';
import logo from '../assets/logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface HeaderProps { 
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({onSearch}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-input') && !target.closest('.bi-search')) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
    setTimeout(() => {
      if (isSearchVisible) {
        (document.querySelector('.search-input') as HTMLInputElement)?.focus();
      }
    }, 0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch?.(query); 
  };

  return (
    <div className="header">
      <div className="logo-container">
        <img src={logo} alt="Brand Logo" id="logo" />
      </div>
      <div className="icons">
        <i
          className={`bi bi-search search-icon ${isSearchVisible ? 'hidden' : ''}`}
          onClick={handleSearchToggle}
          aria-label="Search"
        ></i>
        <i className="bi bi-bell" aria-label="Notifications"></i>
        <i className="bi bi-cart" aria-label="Cart"></i>
      </div>
      {isSearchVisible && (
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
      )}
    </div>
  );
};

export default Header;
