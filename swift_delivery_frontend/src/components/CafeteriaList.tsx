import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCafeterias } from '../services/api.ts';  
import '../styles/CafeteriaList.scss';
import logo from '../assets/logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Cafeteria {
  id: number;
  name: string;
  image: string | null; 
}

const CafeteriaList: React.FC = () => {
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const getCafeterias = async () => {
      try {
        const data = await fetchCafeterias();
        setCafeterias(data);
      } catch (error) {
        console.error('Error fetching cafeterias:', error);
      }
    };

    getCafeterias();
  }, []);

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
    setSearchQuery(event.target.value);
  };

  const filteredCafeterias = cafeterias.filter((cafeteria) =>
    cafeteria.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
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
          <i className="bi bi-cart"></i>
        </div>
        {isSearchVisible && (
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search cafeterias..."
          />
        )}

      </div>
      <div className='cafeterias-title'>
          <h1>Cafeterias</h1>
      </div>
      <ul className="cafeteria-list">
        {filteredCafeterias.map(cafeteria => (
          <li key={cafeteria.id}  className="cafeteria-container">
            <div>
               {cafeteria.image && (
                  <img 
                    src={cafeteria.image}
                    alt={cafeteria.name} 
                  />
                )}
                <br />
                <div className="cafeteria-name">                    
                    <strong>{cafeteria.name}</strong>                    
                    <div id="arrow-icon">
                        <Link to={`/cafeteria/${cafeteria.id}`}>
                            <i className="bi bi-arrow-right-circle-fill"></i>
                        </Link>
                    </div>
                </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CafeteriaList;