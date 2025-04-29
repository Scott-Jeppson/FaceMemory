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
            <div className="peopleSection">
                <h2>Recent People</h2>
                {people.slice(0, 10).map((person) => (
                    <Link to={`/people/${person.id}`} key={person.id}>
                        <Person person={person} />
                    </Link>
                ))}
            </div>
            <div className="groupSection">
                <h2>Recent Groups</h2>
                {groups.slice(0, 10).map((group) => (
                    <Link to={`/groups/${group.id}`} key={group.id}>
                        <Group group={group} />
                    </Link>
                ))}
            </div>
        </div>
    )
}