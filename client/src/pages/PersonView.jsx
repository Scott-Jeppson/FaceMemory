import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Person } from "../components/Person";
import { Spinner } from "../components/Loading";
import { getUser } from "../utils/getUser";

export function PersonView() {
    const { personId } = useParams(); // Get the id from the URL
    const [person, setPerson] = useState(null);

    console.log(personId);

    useEffect(() => {
        async function fetchPerson() {
            try {
                const response = await fetch(`http://localhost:8000/people/${personId}`, {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getUser().csrfToken,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setPerson(data.person);
                } else {
                    console.error("Failed to fetch person:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching person:", error);
            }
        }

        fetchPerson();
    }, [personId]);

    if (!person) {
        return <Spinner />;
    }

    return (
        <div className="pageContent">
            <h1>{person.name}</h1>
            <Person person={person} detailed={true} />
            <Link to="/people">Back to People</Link>
        </div>
    );
}