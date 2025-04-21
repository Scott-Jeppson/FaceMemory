import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { getUser } from "../utils/getUser";

export function People() {
    const [people, setPeople] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const currentUser = await getUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchPeople() {
            try {
                const response = await fetch('/api/people');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPeople(data);
            } catch (error) {
                console.error("Error fetching people:", error);
            }
        }

        fetchPeople();
    }, []);

    return (
        <div className="pageContent">
            <Link to="/people/new_person">New Person</Link>
            <h1>People</h1>
            <div className="people">
                {people.map((person) => (
                    <div key={person.id} className="person">
                        <Link to={`/people/${person.id}`}>
                            <img src={person.image} alt={person.name} />
                            <h2>{person.name}</h2>
                            <h3>{person.notes ? "Details" : "No Details"}</h3>
                            {person.notes.slice(0,5).map((note) => (
                                <p key={note.id} className="note">
                                    {note.text}
                                </p>
                            ))}
                            <h3>{person.groups ? "Groups" : "Not in Any Groups"}</h3>
                            {person.groups.slice(0,5).map((group) => (
                                <p key={group.id} className="group">
                                    {group.name}
                                </p>
                            ))}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )   
}