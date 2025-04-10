import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'


const router = createHashRouter([
  {
    path: "/",
    element: <Dashboard />,
  }
]);

function Dashboard() {
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
          Face Memory
        </div>
        <div id="navBarButtons">
          <Link to="/people">People</Link>
          <Link to="/groups">Groups</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <Outlet />
    </>
  )
}

export default App;
