import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from "../utils/getUser";
import { Search } from '../components/ItemSearch';

export function NewPerson() {
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

    return (
        <div className="pageContent">
            <div className="header">
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
                    selectedGroups.forEach((group) => {
                        formData.append("groups", group.id);
                    });

                    try {
                        const response = await fetch("http://localhost:8000/people/new/", {
                            method: "POST",
                            headers: {
                                "X-CSRFToken": csrfToken,
                            },
                            body: formData,
                            credentials: "same-origin",
                        });

                        if (response.ok) {
                            const result = await response.json();
                            console.log("Person created successfully:", result);
                            window.location.href = "/#/people";
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
                        <button type="submit">Create</button>
                    </div>

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
                
            </form>
        </div>
    )
}