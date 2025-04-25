export function Person({ 
    person,
    detailed = false,
    ...props
}) {
    console.log("Person Image:", person.image);
  return (
    <>
    <img src={person.image ? `http://localhost:8000/media/${person.image}` : '/assets/default-image.png'} alt={person.name} />
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
                    {group.name}
                </p>
            ))
        ) : (
            person.groups.slice(0, 5).map((group) => (
                <p key={group.id} className="group">
                    {group.name}
                </p>
            ))
        )
    ) : null}
  </>
  );
}