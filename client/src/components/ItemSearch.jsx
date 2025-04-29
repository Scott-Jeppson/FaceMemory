import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Search({ 
    items, // Generic list of items (e.g., people or groups)
    selectedItems, // Selected items (e.g., members or selected groups)
    selection, // Boolean to enable/disable selection mode
    add, // Function to add an item
    remove, // Function to remove an item
    getItemName, // Function to get the name of an item
    getItemLink, // Function to get the link for an item
    ...props
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    useEffect(() => {
        const results = items.filter(item =>
            getItemName(item).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(results);
    }
    , [searchTerm, items, getItemName]);

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    return (
        <div className="searchList">
            <h2>Search</h2>
            <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={handleSearchChange}
            />
            <div className="searchResults">
                {selection ? (
                    <>
                        <h3>Selected:</h3>
                        {selectedItems.map((item) => (
                            <div key={item.id} className="searchResult">
                                <h4>{getItemName(item)}</h4>
                                <button type="button" className="remove_button_" onClick={() => remove(item)}>Remove</button>
                            </div>
                        ))}
                        <h3>Search Results:</h3>
                        {filteredItems.map((item) => (
                            <div key={item.id} className="searchResult">
                                <h4>{getItemName(item)}</h4>
                                <button type="button" className="add_button" onClick={() => add(item)}>Add</button>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h3>Search Results:</h3>
                        {filteredItems.map((item) => (
                            <div key={item.id} className="SearchResult">
                                <Link to={getItemLink(item)}>
                                    <h4>getItemName(item)</h4>
                                </Link>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}