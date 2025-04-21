export function Group({
    group,
    ...props
}) {
  return (
    <>
    <h2>{group.name}</h2>
    <h3>{group.description || "No Description Given"}</h3>
    <h3>{group.members ? "Member: " : "Empty"}</h3>
    {group.members.slice(0,10).map((member) => (
        <p key={member.id} className="member">
            {member.name}
        </p>
    ))}
  </>
  );
}