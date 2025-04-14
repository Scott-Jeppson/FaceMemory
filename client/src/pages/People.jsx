import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'

export function People() {
    const [people, setPeople] = useState([])

    useEffect(() => {
        async function fetchPeople() {
            const res = await fetch("/people/", {
                credentials: "same-origin", // include cookies!
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.get("csrftoken"),
                }
            });

            if (res.ok) {
                const {people} = await res.json();
                setPeople(people);
            } else {
                // handle fetch failed!
            }
        }

        fetchPeople();
    }
    , [])

    return (
        <div class="pageContent">
            <Link to="people/new_person">New Person</Link>
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