import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TmdbFetch } from '../TmdbClient';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { fetchWrapper } from '../FetchWrapper';
import { Movie } from '../interfaces/Movie';


const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // Get movie ID from the URL
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const navigate = useNavigate();  // Hook to navigate to the previous page
  const { logout } = useAuth();

  // Fetch movie details and trailer
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const movieResponse = await TmdbFetch(`/movie/${id}`);
        const movieData: Movie = await movieResponse.json();
        setMovie(movieData);

        // Fetch trailer
        const trailerResponse = await TmdbFetch(`/movie/${id}/videos`);
        const trailerData = await trailerResponse.json();
        if (trailerData.results.length > 0) {
          setTrailer(trailerData.results[0].key);  // Get the first trailer key
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchIsFavorite = async () => {
      try {
        const response = await fetchWrapper(`${import.meta.env.VITE_API_URL}/api/favorites`, {
          method: 'GET'
        }, logout)
        const data = await response.json();
        const isFav = !!data.find(
          (fav: {id: number, user_id: number}) => fav.id.toString() === id
        );
        setIsFavorite(isFav)
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } 
    }

    fetchMovieDetails();
    fetchIsFavorite();
  }, [id]);

  // Handle the back button
  const handleBackClick = () => {
    navigate(-1);  // Navigate back to the previous page
  };

  const handleFavoriteClick = async () => {
    if (!movie)
      return;
    try {
      if (!isFavorite) {
        await fetchWrapper(`${import.meta.env.VITE_API_URL}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movie_id: movie?.id,
          })
        }, logout);
      } else {
        await fetchWrapper(`${import.meta.env.VITE_API_URL}/api/favorites/${movie.id}`, {
          method: 'DELETE',
        }, logout);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setIsFavorite(!isFavorite);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : movie ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className='flex flex-row items-stretch'>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
            >
              Back
            </button>
            <button
              onClick={handleFavoriteClick}
              className={isFavorite
                  ? "ml-4 px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
                  : "ml-4 px-4 py-2 bg-slate-200 text-blue-500 rounded-md mb-4"
                }
            >
              <span className='text-xl'>
                {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
              </span>
            </button>
            <span className=" ml-4 text-3xl font-bold mb-4">{movie.title}</span>
          </div>

          <div className="relative">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          </div>

          <p className="text-lg mb-6">{movie.overview}</p>
          <p><span className='font-bold'>Release date:</span> {movie.release_date}</p>
          <p><span className='font-bold'>Note:</span> {movie.vote_average}/10</p>
          <p><span className='font-bold'>Duration:</span> {movie.runtime} minutes</p>

          {trailer && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Trailer</h2>
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${trailer}`}
                title="Movie Trailer"
                allowFullScreen
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-center">Movie not found</p>
      )}
    </div>
  );
};

export default MovieDetails;
