import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <img
          src="search.svg"
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