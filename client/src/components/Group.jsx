import React from "react";
import { Link } from "react-router-dom";

export function Group({
  group,
  detailed = false,
  ...props
}) {
  return (
    <div className="group_inside" {...props}>
        <h2>{group.name}</h2>
        <h3>{group.description ? "Description:" : "No Description Given"}</h3>
        <div className="group_description">
          {group.description || "No description available"}
        </div>
        <h3>{group.members && group.members.length > 0 ? "Members: " : "No Members"}</h3>
        {detailed && ( // Only render member links if detailed is true
          (group.members || []).map((member) => (
            <p key={member.id} className="member">
              <Link to={`/people/${member.id}`}>
                {member.name}
              </Link>
            </p>
          ))
        )}
    </div>
  );
}