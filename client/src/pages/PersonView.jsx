import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Person } from "../components/Person";
import { Spinner } from "../components/Loading";
import { getUser } from "../utils/getUser";
import { useNavigate } from "react-router-dom";

export function PersonView() {
    const { personId } = useParams(); // Get the id from the URL
    const [person, setPerson] = useState(null);
    const navigate = useNavigate();

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
                    setPerson(data.person);
                } else if (response.status === 404) {
                    navigate("/not-found"); // Redirect to Not Found page
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
            <Link to={`/people/${personId}/edit`}>Edit Person</Link>
        </div>
    );
}