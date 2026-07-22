import React from 'react';
import searchIcon from '/search.svg';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <img
          src={searchIcon}
          alt="search-icon"
          className="search-icon"
        />
        <input
          type="text"
          className="search-input"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;