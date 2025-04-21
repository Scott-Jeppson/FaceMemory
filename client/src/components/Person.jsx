export function Person({ 
    person,
    ...props
}) {
  return (
    <>
    <img src={person.image} alt={person.name} />
    <h2>{person.name}</h2>
    <h3>{person.notes ? "Details" : "No Details"}</h3>
    {person.notes.slice(0,5).map((note) => (
        <p key={note.id} className="note">
            {note.text}
        </p>
    ))}
    <h3>{person.groups ? "Groups" : "Not in Any Groups"}</h3>
    {person.groups.slice(0,5).map((group) => (
        <p key={group.id} className="group">
            {group.name}
        </p>
    ))}
  </>
  );
}