import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from "../utils/getUser";

export function NewPerson() {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [details, setDetails] = useState([]);
    const [user, setUser] = useState(null);

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

                    try {
                        const response = await fetch("/new_person/", {
                            method: "POST",
                            body: formData,
                            credentials: "same-origin",
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
                            <p>Selected Image:</p>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Selected"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                        </div>
                    ) : (
                        <div>
                            <p>No image selected. Using default image:</p>
                            <img
                                src="/assets/default-image.png"
                                alt="Default"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                        </div>
                    )}
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div>
                    <label htmlFor="name">Name:</label>
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
                <div id="buttons_holder">
                    <button type="button" onClick={() => addDetail()}>More Details</button>
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}