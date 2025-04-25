import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from "../utils/getUser";

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
    
    function handleSubmit(event) {
        event.preventDefault();
        const groupData = {
            name: name,
            description: description,
            members: members,
        };

        fetch("/groups/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "same-origin",
            body: JSON.stringify(groupData),
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to create group");
            }
        })
        .then((data) => {
            console.log("Group created:", data);
        })
        .catch((error) => {
            console.error("Error creating group:", error);
        });
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
                <label>
                    Members:
                    <ul>
                        {people.map((person) => (
                            <li key={person.id}>
                                {person.name}
                                <button type="button" onClick={() => addMember(person)}>
                                    +
                                </button>
                                <button type="button" onClick={() => removeMember(person)}>
                                    -
                                </button>
                            </li>
                        ))}
                    </ul>
                </label>
                <button type="submit">Create Group</button>
            </form>
        </div>
    )
}