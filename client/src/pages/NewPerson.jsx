import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NewPerson() {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [details, setDetails] = useState({});

    return (
        <div class="pageContent">
            <div class="header">
                <h1>New Person</h1>
                <Link to="people">Cancel</Link>
            </div>

        </div>
    )
}