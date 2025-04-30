import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Group } from "../components/Group";
import { Spinner } from "../components/Loading";
import { getUser } from "../utils/getUser";
import { useNavigate } from "react-router-dom";

export function GroupView() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchGroup() {
            try {
                const response = await fetch (`http://localhost:8000/groups/${groupId}`, {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getUser().csrfToken,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setGroup(data.group);
                } else if (response.status === 404) {
                    navigate("/not-found"); // Redirect to Not Found page
                }
            } catch (error) {
                console.error("Error fetching group: ", error);
            }
        }

        fetchGroup();
    }, [groupId]);

    if (!group) {
        return <Spinner />;
    }

    return (
        <div className="pageContent">
            <Group group={group} detailed={true} />
            <Link to="/groups">Back to Groups</Link>
            <Link to={`/groups/${groupId}/edit`}>Edit Group</Link>
        </div>
    )
}