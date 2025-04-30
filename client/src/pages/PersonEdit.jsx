import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUser } from "../utils/getUser";
import { Search } from '../components/ItemSearch';
import { Spinner } from '../components/Loading';

export function PersonEdit() {
    const { personId } = useParams();
    const [person, setPerson] = useState(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [details, setDetails] = useState([]);
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }

    const csrfToken = getCookie('csrftoken');

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

    useEffect(() => {
        async function fetchPerson() {
            try {
                const response = await fetch(`http://localhost:8000/people/${personId}`);
                if (response.ok) {
                    const responseData = await response.json();
                    const personData = responseData.person;
                    setPerson(personData);
                    setName(personData.name);
                    setImage(personData.image); // Assuming the backend returns the image URL
                    setDetails(personData.notes || []);
                    setSelectedGroups(personData.groups || []);
                } else {
                    console.error("Failed to fetch person:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching person:", error);
            }
        }

        fetchPerson();
    }, [personId]);

    function addDetail() {
        setDetails((prevDetails) => [...prevDetails, { key: '', value: '' }]);
    }

    function addGroup(group) {
        if (!selectedGroups.includes(group)) {
            setSelectedGroups((prevGroups) => [...prevGroups, group]);
        }
    }

    function removeGroup(group) {
        setSelectedGroups((prevGroups) => prevGroups.filter((g) => g !== group));
    }

    useEffect(() => {
        async function fetchGroups() {
            try {                
                const response = await fetch("http://localhost:8000/groups/", {
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

    if (!user || !groups.length || !person) {
        return (
            <div className="pageContent">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="pageContent">
            <div className="header">
                <h1>Edit Person</h1>
                <Link to={`/people/${personId}`}>Cancel</Link>
                <button type="submit" onClick={(e) => {
                    e.preventDefault();
                    if (confirm("Are you sure you want to delete this person?")) {
                        fetch(`http://localhost:8000/people/${personId}/delete/`, {
                            method: "DELETE",
                            headers: {
                                "X-CSRFToken": csrfToken,
                            },
                            credentials: "same-origin",
                        })
                        .then((response) => {
                            if (response.ok) {
                                window.location.href = "/#/people";
                            } else {
                                console.error("Failed to delete person:", response.statusText);
                            }
                        })
                        .catch((error) => {
                            console.error("Error deleting person:", error);
                        });
                    }
                }}>Delete Person</button>
            </div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    const formData = new FormData();
                    formData.append("name", name);
                    formData.append("image", image);
                    formData.append("details", JSON.stringify(details));
                    formData.append("groups", JSON.stringify(selectedGroups.map((group) => group.id)));

                    try {
                        const response = await fetch(`http://localhost:8000/people/${personId}/edit/`, {
                            method: "PUT",
                            headers: {
                                "X-CSRFToken": csrfToken,
                            },
                            body: formData,
                            credentials: "same-origin",
                        });

                        if (response.ok) {
                            const result = await response.json();
                            console.log("Person updated successfully:", result);
                            window.location.href = `/#/people/${result.id}`;
                        } else {
                            console.error("Failed to create person:", response.statusText);
                        }
                    } catch (error) {
                        console.error("Error submitting form:", error);
                    }
                }}
            >
                <div>
                    <div id="buttons_holder">
                        <button type="button" onClick={() => addDetail()}>More Details</button>
                        <button type="submit">Save Changes</button>
                    </div>

                    {image && typeof image === "string" ? (
                        <div>
                            <p>Current Image: </p>
                            <img className="person_image"
                                src={image}
                                alt="Current"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                        </div>
                    ) : image ? (
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
                                src="http://localhost:8000/media/default-image.png"
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

                <div id="groups_container">
                    <h3>Groups</h3>
                    {selectedGroups.map((group, index) => (
                        <div key={index}>
                            <Link to={`/groups/${group.id}`}>
                                {group.name}
                            </Link>
                            <button type="button" onClick={() => removeGroup(group)}>Remove</button>
                        </div>
                    ))}
                </div>

                <Search
                    items={groups}
                    selectedItems={selectedGroups}
                    selection={true}
                    add={addGroup}
                    remove={removeGroup}
                    getItemName={(group) => group.name}
                    getItemLink={(group) => `/groups/${group.id}`}
                />
                
                </div>
            </form>
        </div>
    )
}