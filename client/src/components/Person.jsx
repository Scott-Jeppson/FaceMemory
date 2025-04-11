export function Person({ 
    person,
    ...props
}) {
  return (
    <div className="person">
      <img src={person.image} alt={person.name} />
      <h2>{person.name}</h2>
    </div>
  );
}