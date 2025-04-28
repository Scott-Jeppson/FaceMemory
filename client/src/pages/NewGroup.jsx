import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from "../utils/getUser";
import { Search } from '../components/ItemSearch';

export function NewGroup() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState([]);
    const [people, setPeople] = useState([]);
    const [user, setUser] = useState(getUser());

    useEffect(() => {
        async function fetchPeople() {
            try {
                const response = await fetch("http://localhost:8000/people/", {
                    method: "GET",
                    credentials: "same-origin",
                    user: user,
                });

                if (response.ok) {
                    const data = await response.json();
                    setPeople(data);
                } else {
                    console.error("Failed to fetch people:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching people:", error);
            }
        }

        fetchPeople();
    }, []);

    function addMember(person) {
        if (!members.includes(person)) {
            setMembers((prevMembers) => [...prevMembers, person]);
        }
    }

    function removeMember(person) {
        setMembers((prevMembers) => prevMembers.filter((member) => member !== person));
    }
    
    async function handleSubmit(event) {
        event.preventDefault();

        const groupData = {
            name: name,
            description: description,
            members: members,
        };

        try {
            const response = fetch("/groups/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "same-origin",
                body: JSON.stringify(groupData),
            });

            if (response.ok) {
                const response = await response.json();
                console.log("Group created successfully:", response);
                window.location.href = "/#/groups";
            } else {
                console.error("Failed to create group:", response.statusText);
            }
        }
        catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    return (
        <div className="pageContent">
            <div className="header">
                <h1>New Group</h1>
                <Link to="/groups">Cancel</Link>
            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <Search
                    items={people}
                    selectedItems={members}
                    selection={true}
                    add={addMember}
                    remove={removeMember}
                    getItemName={(person) => person.name}
                    getItemLink={(person) => `/people/${person.id}`}
                />
                <button type="submit">Create Group</button>
            </form>
        </div>
    )
}