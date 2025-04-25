import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { getUser } from "../utils/getUser";
import { Person } from "../components/Person";

export function People() {
    const [people, setPeople] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function fetchUser() {
            try {
                const currentUser = await getUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }

        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchPeople() {
            try {
                const response = await fetch('/people');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("Fetched People:", data);
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
                            <Person person={person} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )   
}