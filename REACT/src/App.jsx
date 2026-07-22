import { useState, useEffect } from 'react';
import Search from './components/Search.jsx';
import { fetchMovies, fetchTrending } from './services/api.js';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem('likedMovies');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    fetchTrending().then(setTrending).catch(console.error);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const results = await fetchMovies(debouncedTerm);
        setMovies(results);
      } catch (err) {
        setErrorMessage('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [debouncedTerm]);

  const toggleLike = (id) => {
    const updated = liked.includes(id)
      ? liked.filter((x) => x !== id)
      : [...liked, id];
    setLiked(updated);
    localStorage.setItem('likedMovies', JSON.stringify(updated));
  };

const formatLikes = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  const MovieCard = ({ movie }) => (
    <li className="movie-card">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://placehold.co/220x330?text=No+Image'
        }
        alt={movie.title}
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-meta">
          {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
          {' · ⭐ '}
          {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
        </p>
        <p className="movie-likes">
          ❤️ {formatLikes(movie.vote_count)} people liked this
        </p>
        <button
          className={`like-btn ${liked.includes(movie.id) ? 'liked' : ''}`}
          onClick={() => toggleLike(movie.id)}
        >
          {liked.includes(movie.id) ? '❤️ Liked' : '🤍 Like'}
        </button>
      </div>
    </li>
  );
return (
    <main>
      <div className="pattern">

        {/* Header stays centered */}
        <div className="wrapper">
          <header className="flex flex-col items-center text-center">
            <img src="hero-img.png" alt="Hero banner" />
            <h1>
              find <span className="text-gradient">movies</span> you will enjoy <br />without hassle...
            </h1>
          </header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Movie grids are full width outside wrapper */}
        <div className="full-width">
          {trending.length > 0 && !searchTerm && (
            <section className="trending-section">
              <h2 className="section-title">🔥 Most Viewed This Week</h2>
              <ul className="movies-grid">
                {trending.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            </section>
          )}

          <section className="movies-section">
            <h2 className="section-title">
              {searchTerm ? `Results for "${searchTerm}"` : '🎬 Popular Movies'}
            </h2>
            {isLoading ? (
              <p className="status-text">Loading...</p>
            ) : errorMessage ? (
              <p className="status-text error-text">{errorMessage}</p>
            ) : (
              <ul className="movies-grid">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>

      </div>
    </main>
  );
  
};

export default App;