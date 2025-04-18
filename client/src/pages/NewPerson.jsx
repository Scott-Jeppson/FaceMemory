import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from "../utils/getUser";

export function NewPerson() {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [details, setDetails] = useState([]);
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const currentUser = await getUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }

        fetchData();
    }, []);

    function addDetail() {
        setDetails((prevDetails) => [...prevDetails, { key: '', value: '' }]);
    }

    useEffect(() => {
        async function fetchGroups() {
            try {                
                const response = await fetch("/groups/", {
                    method: "GET",
                    credentials: "same-origin",
                    user: user,
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setGroups(data);
                } else {
                    console.error("Failed to fetch groups:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        }

        fetchGroups();
    }, []);

    return (
        <div class="pageContent">
            <div class="header">
                <h1>New Person</h1>
                <Link to="/people">Cancel</Link>
            </div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    const formData = new FormData();
                    formData.append("name", name);
                    formData.append("image", image);
                    formData.append("details", JSON.stringify(details));
                    formData.append("group", e.target.group.value);

                    try {
                        const response = await fetch("/new_person/", {
                            method: "POST",
                            body: formData,
                            credentials: "same-origin",
                            user: user,
                        });

                        if (response.ok) {
                            const result = await response.json();
                            console.log("Person created successfully:", result);
                            person = result.
                            window.location.href = "/people";
                        } else {
                            console.error("Failed to create person:", response.statusText);
                        }
                    } catch (error) {
                        console.error("Error submitting form:", error);
                    }
                }}
            >
                <div>
                    {image ? (
                        <div>
                            <p>Selected Image: </p>
                            <img className="person_image"
                                src={URL.createObjectURL(image)}
                                alt="Selected"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                        </div>
                    ) : (
                        <div>
                            <p>No image selected. Using default image: </p>
                            <img className="person_image"
                                src="/assets/default-image.png"
                                alt="Default"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                        </div>
                    )}
                    <label htmlFor="image">Image: </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div>
                    <label htmlFor="name">Name: </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="group">Group: </label>
                    <select 
                        id="group" 
                        name="group"
                        onChange={(e) => {
                            if (e.target.value === "new_group") {
                                window.location.href = "/#/groups/new_group";
                            }
                        }}
                    >
                        <option value="" disabled selected>
                            Select a group
                        </option>
                        {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                        <option in="no_group" value="">
                            No Group
                        </option>
                        <option id="new_group" value="new_group">
                            <Link to="/groups/new_group">New Group</Link>
                        </option>
                    </select>
                </div>
                <div id="details_container">
                {details.map((detail, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder="Label"
                            value={detail.key}
                            onChange={(e) => {
                                const newDetails = [...details];
                                newDetails[index].key = e.target.value;
                                setDetails(newDetails);
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Information"
                            value={detail.value}
                            onChange={(e) => {
                                const newDetails = [...details];
                                newDetails[index].value = e.target.value;
                                setDetails(newDetails);
                            }}
                        />
                    </div>
                ))}
                </div>
                <div id="buttons_holder">
                    <button type="button" onClick={() => addDetail()}>More Details</button>
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}