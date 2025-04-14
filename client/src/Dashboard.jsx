import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

export function Dashboard() {
  const [count, setCount] = useState(0)

  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin", // include cookies!
    });

    if (res.ok) {
      // navigate away from the single page app!
      window.location = "/registration/sign_in/";
    } else {
      // handle logout failed!
    }
  }

  return (
    <>
      <nav className="navBar">
        <div id="title">
          <Link to="/">Face Memory</Link>
        </div>
        <div id="navBarButtons">
          <Link to="/people">People</Link>
          <Link to="/groups">Groups</Link>
          <button id="outButton" onClick={logout}>Logout</button>
        </div>
      </nav>
      <Outlet />
    </>
  )
}


