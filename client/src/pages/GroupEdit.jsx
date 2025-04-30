import React from "react";
import { Link } from "react-router-dom";
import { Search } from "../components/ItemSearch";
import { getUser } from "../utils/getUser";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/Loading";

export function GroupEdit() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [user, setUser] = useState(null);
    const [people, setPeople] = useState([]);
    const [members, setMembers] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return '';
        }
    
    const csrfToken = getCookie('csrftoken');

    useEffect(() => {
        async function fetchPeople() {
            try {
                const response = await fetch("http://localhost:8000/people/", {
                    method: "GET",
                    credentials: "same-origin",
                    user: user
                });

                if (response.ok) {
                    const data = await response.json();
                    setPeople(data);
                } else {
                    console.error("Failed to fetch people:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching people:", error);
            }
        }

        fetchPeople();
    }, []);

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
        async function fetchGroup() {
            try {
                const response = await fetch(`http://localhost:8000/groups/${groupId}/`, {
                    method: "GET",
                    credentials: "same-origin",
                    user: user,
                });

                if (response.ok) {
                    const data = await response.json();
                    const theGroup = data.group;
                    setGroup(theGroup);
                    setName(theGroup.name);
                    setDescription(theGroup.description || '');
                    setMembers(theGroup.members);
                } else {
                    console.error("Failed to fetch group:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching group:", error);
            }
        }

        fetchGroup();
    }, [groupId, user]);

    function addMember(person) {
        if (!members.includes(person)) {
            setMembers((prevMembers) => [...prevMembers, person]);
        }
    }

    function removeMember(person) {
        setMembers((prevMembers) => prevMembers.filter((member) => member !== person));
    }
    
    async function handleSubmit(event) {
        event.preventDefault();

        const groupData = {
            "name": name,
            "description": description,
            "members": members.map((member) => member.id)
        };

        try {
            const res = await fetch(`http://localhost:8000/groups/${groupId}/edit/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "same-origin",
                body: JSON.stringify(groupData),
            });

            if (res.ok) {
                const response = await res.json();
                console.log("Group Updated successfully:", response);
                window.location.href = `/#/groups/${groupId}`;
            } else {
                console.error("Failed to create group:", response.statusText);
            }
        }
        catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    if (!group) {
        return (
        <div className="pageContent">
            <Spinner />
        </div>
        )
    }
    
    return (
        <div className="pageContent">
            <div className="header">
                <h1>Edit Group: {group.name}</h1>
                <Link to={`/groups/${groupId}`}>Cancel</Link>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="buttons_holder">
                    <button type="submit">Update Group</button>
                    <button type="button" onClick={(e) => {
                        e.preventDefault();
                        if (confirm("Are you sure you want to delete this group?")) {
                            fetch(`http://localhost:8000/groups/${groupId}/delete`, {
                                method: "DELETE",
                                headers: {
                                    "X-CSRFToken": csrfToken,
                                },
                                credentials: "same-origin",
                            })
                            .then((response) => {
                                if (response.ok) {
                                    window.location.href = "/#/groups";
                                } else {
                                    console.error("Failed to delete group:", response.statusText);
                                }
                            })
                            .catch((error) => {
                                console.error("Error deleting group:", error);
                            });
                        }
                    }}>Delete Group</button>
                </div>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <Search
                    items={people}
                    selectedItems={members}
                    selection={true}
                    add={addMember}
                    remove={removeMember}
                    getItemName={(person) => person.name}
                    getItemLink={(person) => `/people/${person.id}`}
                />
            </form>
        </div>
    )
}