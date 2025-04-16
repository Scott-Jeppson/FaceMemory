
export async function getUser() {
    const res = await fetch("/user/", {
        credentials: "same-origin",
    })
    if (res.ok) {
        const user = await res.json();
        return user;
    } else {
        throw new Error("Failed to fetch user");
    }
}