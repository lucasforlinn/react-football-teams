import React from 'react'

const TeamCard = ({team: {name, stadium, established, id, code}}) => {
    return (
        <div className="movie-card">
            <img src={`https://media.api-sports.io/american-football/teams/${id}.png`}/>
            
            <div className="mt-4">
                <h3>{name}</h3>

                <div className="content">
                    <p className="lang">{code ? code : 'N/A'}</p>
                    <span>•</span>
                <div className="rating">
                    <span className="year">{established ? established: 'N/A'}</span>
                </div>
                    <span>•</span>
                    <p className="text-gradient">{stadium ? stadium : 'N/A'}</p>
                </div>
            </div>
        </div>
    )
}
export default TeamCard
