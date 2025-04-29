import React from "react";
import { Link } from "react-router-dom";

export function Person({ 
    person,
    detailed = false,
    ...props
}) {

    console.log(person.image);
  return (
    <>
    <img src={person.image ? `http://localhost:8000/${person.image}` : 'http://localhost:8000/default-image.png'} alt={person.image ? person.name : "Default Image"} />
    <h2>{person.name}</h2>
    <h3>{person.notes ? "Details" : "No Details"}</h3>
    {Array.isArray(person.notes) ? (
        detailed ? (
            person.notes.map((note) => (
                <p key={note.key} className="note">
                    {note.key}: {note.value}
                </p>
            ))
        ) : (
            person.notes.slice(0, 5).map((note) => (
                <p key={note.key} className="note">
                    {note.value}
                </p>
            ))
        )
    ) : <p>Not an array</p>}

    <h3>{person.groups ? "Groups" : "Not in Any Groups"}</h3>
    {Array.isArray(person.groups) ? (
        detailed ? (
            person.groups.map((group) => (
                <p key={group.id} className="group">
                    <Link to={`/groups/${group.id}`}>
                        {group.name}
                    </Link>
                </p>
            ))
        ) : (
            person.groups.slice(0, 5).map((group) => (
                <p key={group.id} className="group">
                    <Link to={`/groups/${group.id}`}>
                        {group.name}
                    </Link>
                </p>
            ))
        )
    ) : null}
  </>
  );
}