export async function getPeople() {
    const res = await fetch("/people/", {
        credentials: "same-origin",
    });
    if (res.ok) {
        const people = await res.json();
        return people;
    } else {
        throw new Error("Failed to fetch people");
    }
}


export async function getPerson(id) {
    const res = await fetch(`/people/${id}/`, {
        credentials: "same-origin",
    });
    if (res.ok) {
        const person = await res.json();
        return person;
    } else {
        throw new Error("Failed to fetch person");
    }
}

export async function getGroups() {
    const res = await fetch("/groups/", {
        credentials: "same-origin",
    });
    if (res.ok) {
        const groups = await res.json();
        return groups;
    } else {
        throw new Error("Failed to fetch groups");
    }
}

export async function getGroup(id) {
    const res = await fetch(`/groups/${id}/`, {
        credentials: "same-origin",
    });
    if (res.ok) {
        const group = await res.json();
        return group;
    } else {
        throw new Error("Failed to fetch group");
    }
}