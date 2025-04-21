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
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )   
}