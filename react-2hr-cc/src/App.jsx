import React, {useEffect, useState} from 'react'
import Search from "./components/search.jsx";

// Our base API URL.
const API_BASE_URL = 'https://api.themoviedb.org/3/';
// Our API key fetched from our local env.
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// Our API GET
const API_OPTIONS = {
    method: 'GET', headers: {
        accept: 'application/json', Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    const fetchMovies = async () => {
        try {
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS)
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
            }


        } catch (error) {
            console.log(`Error Fetching Movies: ${error}`);
            setErrorMessage('Error fetching movies, please try again later.');
        }
    }

    useEffect(() => {
        fetchMovies();
    }, []);

    return (<main>
        <div className="pattern"/>
        <div className="wrapper">
            <header>
                <img src="./hero.png" alt="Hero Banner"/>
                <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without Any Hassle</h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </header>
            <section className="all-movies">
                <h2>All Movies</h2>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            </section>
        </div>
    </main>)
}
export default App
