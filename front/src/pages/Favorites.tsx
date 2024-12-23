import React, { useEffect, useState } from "react";
import { Movie } from "../interfaces/Movie";
import { fetchWrapper } from "../FetchWrapper";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { TmdbFetch } from "../TmdbClient";

const Favorites: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await fetchWrapper(`${import.meta.env.VITE_API_URL}/api/favorites`, {
          method: 'GET'
        }, logout).then(response => response.json());
        const data = await Promise.all(favorites.map(async (fav: {id: number}) => {
          return TmdbFetch(`/movie/${fav.id}`).then(response => response.json());
        }));
        setMovies(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleBackClick = () => {
    navigate(-1);  // Navigate back to the previous page
  };

  return (
      <div className="container mx-auto p-4">
        <div className="flex flex-fow items-stretch">
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4 mr-4"
            >
              Back
            </button>
          <h1 className="text-3xl font-semibold mb-4">Favorites</h1>
        </div>
        {loading
          ? <p className="text-center">Loading...</p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`} className="group">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity duration-200"
                    />
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold">{movie.title}</h3>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center">No movies found</p>
            )}
          </div>
        }
      </div>
  );
}

export default Favorites;
