import React from "react";
import { Link } from "react-router-dom";
import { Search } from "../components/ItemSearch";
import { useState, useEffect } from "react";
import { getUser } from "../utils/getUser";
import { Person } from "../components/Person";
import { Group } from "../components/Group";

export function FrontPage() {
    const [user, setUser] = useState(null);
    const [people, setPeople] = useState([]);
    const [filteredPeople, setFilteredPeople] = useState([]);
    const [peopleSearchTerm, setPeopleSearchTerm] = useState("");
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [groupsSearchTerm, setGroupsSearchTerm] = useState("");

    useEffect(() => {
        async function fetchData() {
            const user = await getUser();
            setUser(user);
            const peopleResponse = await fetch("http://localhost:8000/people");
            const peopleData = await peopleResponse.json();
            setPeople(peopleData);
            const groupsResponse = await fetch("http://localhost:8000/groups");
            const groupsData = await groupsResponse.json();
            setGroups(groupsData);
        }
        fetchData();
    }, []);

    return (
        <div className="pageContent">
            <h2>Recent People</h2>
            <div className="people">
                {people.map((person) => (
                    <Link to={`/people/${person.id}`} key={person.id}>
                        <Person person={person} />
                    </Link>
                ))}
            </div>
            <h2>Recent Groups</h2>
            <div className="groups">
                {groups.map((group) => (
                    <Link to={`/groups/${group.id}`} key={group.id}>
                        <Group group={group} detailed="false"/>
                    </Link>
                ))}
            </div>
        </div>
    )
}