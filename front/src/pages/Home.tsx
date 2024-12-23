import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdFavorite, MdFilterList, MdFilterListOff, MdLogout, MdOutlineSearch } from 'react-icons/md';
import { TmdbFetch } from '../TmdbClient';
import { Movie, MovieApiResponse } from '../interfaces/Movie';


const Home: React.FC = () => {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAdult, setShowAdult] = useState<boolean>(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      const path = !!search ? `/search/movie` : `discover/movie`;
      const params = new URLSearchParams();
      if (!!search) {
        params.append('query', search);
      }
      params.append('page', page.toString());
      if (showAdult) {
        params.append('include_adult', 'true');
      }
      if (!!date) {
        params.append('primary_release_date.lte', date);
      }
      const response = await TmdbFetch(`${path}?${params}`);
      const data: MovieApiResponse = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return; // Prevent going out of bounds
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  //reset search when search changes
  useEffect(() => {
    setCurrentPage(1);
    setMovies([]);
    setTotalPages(1);
    fetchMovies(1);
  }, [search, showAdult, date]);

  return (
    <div className="px-4 min-h-screen bg-slate-100">
      <div className='sticky top-0 p-4 bg-slate-100'>
        <div className='flex flex-row bg-white shadow-lg py-2 px-4 rounded-full items-center'>
          <span className='text-3xl text-slate-500'><MdOutlineSearch /></span>
          <input
            onChange={(e) => setSearch(e.target.value)}
            className='block ml-3 w-full border-0 border-b focus:outline-0 focus:ring-0 border-gray-300 focus:border-black placeholder-slate-500'
            placeholder='Search...'
          />
          <button onClick={() => setShowFilter(!showFilter)} className='group flex flex-row items-center ml-4 hover:bg-slate-200 rounded-full p-2'>
            <span className='text-2xl text-slate-500 group-hover:text-black'>
              {showFilter ? <MdFilterListOff /> : <MdFilterList />}
            </span>
          </button>
          <button onClick={(_) => navigate('/favorites')} className='group flex flex-row items-center ml-4 hover:bg-slate-200 rounded-full p-2'>
            <span className='text-2xl text-slate-500 group-hover:text-black'><MdFavorite /></span>
          </button>
          <button onClick={logout} className='group flex flex-row items-center ml-4 hover:bg-slate-200 rounded-full p-2'>
            <span className='text-2xl text-slate-500 group-hover:text-black'><MdLogout /></span>
          </button>
        </div>
        {showFilter && <div className='flex flex-row items-center mt-2'>
          <div className='flex flex-row items-center py-2 px-4 hover:bg-slate-200 rounded-full bg-white shadow-lg'>
            <input
              type='checkbox'
              id='adult'
              checked={showAdult}
              onChange={(e) => setShowAdult(e.target.checked)}
              className='mr-2 rounded-full'
            />
            <label htmlFor='adult' className='text-lg'>Show adult content</label>
          </div>
          <div className='flex flex-row items-center py-2 px-4 rounded-full bg-white shadow-lg ml-4'>
            <label htmlFor='date' className='text-lg mr-2'>Released before:</label>
            <input
              type='date'
              id='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='rounded-full outline-none border-0 focus:ring-0 focus:border-black'
            />
          </div>
        </div>
        }
      </div>
      <div className="container mx-auto p-4">
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

        {totalPages > 1 && <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>}
      </div>
    </div>
  );
};

export default Home;
