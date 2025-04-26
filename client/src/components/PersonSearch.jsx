import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function PersonSearch({ 
    people,
    members,
    selection,
    add,
    remove,
    ...props
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPeople, setFilteredPeople] = useState(people);

    useEffect(() => {
        const results = people.filter(person =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPeople(results);
    }
    , [searchTerm, people]);

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const results = people.filter(person =>
                person.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPeople(results);
        }
    }

    return (
        <div className="personSearch">
            <h2>Search for a Person</h2>
            <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                onKeyDown={handleKeyPress}
            />
            <div className="searchResults">
                {selection ? (
                    <>
                        <h3>Selected Members:</h3>
                        {members.map((person) => (
                            <div key={person.id} className="personSearchResult">
                                <h4>{person.name}</h4>
                                <button className="remove_button_person_search" onClick={() => remove(person)}>Remove</button>
                            </div>
                        ))}
                        <h3>Search Results:</h3>
                        {filteredPeople.map((person) => (
                            <div key={person.id} className="personSearchResult">
                                <h4>{person.name}</h4>
                                <button className="add_button_person_search" onClick={() => add(person)}>Add</button>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h3>Search Results:</h3>
                        {filteredPeople.map((person) => (
                            <div key={person.id} className="personSearchResult">
                                <Link to={`/people/${person.id}`}>
                                    <h4>{person.name}</h4>
                                </Link>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}