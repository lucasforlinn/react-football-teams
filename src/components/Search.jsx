import React from 'react'

const Search = ({seachTerm, setSearchTerm}) => {
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search"/>

                <input type="text" placeholder="Search a football team" value={seachTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
        </div>
    )
}
export default Search
