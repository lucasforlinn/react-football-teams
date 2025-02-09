import './App.css'
import Search from "./components/Search.jsx";
import {useEffect, useState} from "react";
import Spinner from "./components/Spinner.jsx";
import TeamCard from "./components/TeamCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingTeams, updateSearchCount} from "./appwrite.js";

const API_BASE_URL = "https://v1.american-football.api-sports.io/teams?"
const API_KEY = import.meta.env.VITE_APIFOOTBALL_API_KEY;
const API_OPTIONS = {
    method: "GET",
    headers: {
        'x-apisports-key': `${API_KEY}`
    }
}

const App = () => {
    const [teams, setTeams] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [trendingTeams, setTrendingTeams] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

    const fetchTeams = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ?   `${API_BASE_URL}search=${encodeURIComponent(query)}`
                :   `${API_BASE_URL}league=1&season=2023`

            const response = await fetch(endpoint, API_OPTIONS)

            if(!response.ok) {
                throw new Error("Failed to fetch teams")
            }

            const data = await response.json();

            if(data.response === 'False'){
                setErrorMessage(data.Error || 'Failed to get team')
                setTeams([]);
                return;
            }

            setTeams(data.response || []);

            if(query && data.response.length > 0){
                await updateSearchCount(query, data.response[0])
            }
        } catch (e) {
            console.error(e)
            setErrorMessage('Failed to fetch teams')
        } finally {
            setIsLoading(false)
        }
    }

    const loadTrendingTeams = async () => {
        try {
            const teams = await getTrendingTeams();

            setTrendingTeams(teams);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchTeams(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingTeams();
    }, []);

    return (
        <main>
            <div className="patter"></div>
            <div className="wrapper">
                <header>
                    <img src="./stadium.jpg" alt="stadium banner"/>

                    <h1>Search for <span className="text-gradient">Football</span> teams you like</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingTeams.length > 0 && (
                    <section className="trending">
                        <h2>Trending Teams</h2>
                        
                        <ul>
                            {trendingTeams.map((team, index) => (
                                <li key={team.$id}>
                                    <p>{index + 1}</p>
                                    <img src={team.team_url} alt={team.name}/>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    <h2>All teams</h2>

                    {isLoading ? (
                        <Spinner/>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) :  (
                        <ul>
                            {teams.map(team => (
                                <TeamCard key={team.id} team={team} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>

        </main>
    )
}

export default App
