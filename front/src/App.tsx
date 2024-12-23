import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from "./pages/Register.tsx";
import './index.css';
import {useAuth} from "./context/AuthContext.tsx";
import Home from './pages/Home.tsx';
import MovieDetail from './pages/MovieDetails.tsx';
import Favorites from './pages/Favorites.tsx';

const App: React.FC = () => {
    const authProvider = useAuth();
    const user = authProvider.user;

    return (<Router>
        <Routes>
            <Route path="/" element={user ? <Navigate to="/home"/> : <Navigate to="/login"/>}/>
            <Route path="/login" element={user ? <Navigate to="/home"/> : <Login/>}/>
            <Route path="/register" element={user ? <Navigate to="/home"/> : <Register/>}/>
            <Route path="/home" element={user ? <Home/> : <Navigate to="/login"/>}/>
            <Route path="/favorites" element={user ? <Favorites /> : <Navigate to="/login"/>}/>
            <Route path="/movie/:id" element={user ? <MovieDetail/> : <Navigate to="/login"/>}/>
            <Route path="*" element={user ? <Navigate to="/home"/> : <Navigate to="/login"/>}/>
        </Routes>
    </Router>);
};

export default App;
