import { useEffect, useState } from "react"

export function People() {
    const [people, setPeople] = useState([])

    useEffect(() => {
        async function fetchPeople() {
            const res = await fetch("/people/", {
                credentials: "same-origin", // include cookies!
                headers: {
                    "Content-Type": "application/json",
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
        <div>
            <h1>This is the People Page!</h1>
            
        </div>
    )   
}