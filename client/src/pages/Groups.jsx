import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { getUser } from "../utils/getUser";
import { Group } from "../components/Group";

export function Groups() {
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const currentUser = getUser();

    useEffect(() => {
        async function fetchGroups() {
            try {
                const response = await fetch('/groups');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchGroups();
    }, []);

    return (
        <div className="pageContent">
            <div className="header">
                <h1>Groups</h1>
                <Link to="/groups/new_group">New Group</Link>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="groups">
                    {groups.map((group) => (
                        <div key={group.id} className="group">
                            <Link to={`/groups/${group.id}`}>
                                <Group group={group} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}