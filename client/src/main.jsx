import React, { Children } from 'react'
import ReactDOM from 'react-dom/client'
import { Dashboard } from './Dashboard.jsx'
import { People } from './pages/People'
import { Groups } from './pages/Groups'
import { NewPerson } from './pages/NewPerson'
import { NewGroup } from './pages/NewGroup'
import { PersonEdit } from './pages/PersonEdit'
import { GroupEdit } from './pages/GroupEdit'
import { PersonView } from './pages/PersonView'
import { GroupView } from './pages/GroupView'
import './index.css'
import 'vite/modulepreload-polyfill'
import { createHashRouter, RouterProvider} from 'react-router-dom'
import { UserContext } from './context/userContext'
import { getUser } from './utils/getUser'
import { FrontPage } from './pages/FrontPage.jsx'

const router = createHashRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/",
        element: < FrontPage/>,
      },
      {
        path: "/people",
        element: <People />,
      },
      {
        path: "/people/new_person",
        element: <NewPerson />,
      },
      {
        path: "/people/:personId",
        element: <PersonView />,
      },
      {
        path: "/people/:personId/edit",
        element: <PersonEdit />,
      },
      {
        path: "/groups",
        element: <Groups />,
      },
      {
        path: "/groups/new_group",
        element: <NewGroup />,
      },
      {
        path: "/groups/:groupId",
        element: <GroupView />,
      },
      {
        path : "/groups/:groupId/edit",
        element: <GroupEdit />,
      }
    ]
  }
])

function Main() {
const currentUser = getUser();

  return (
    <UserContext.Provider value={currentUser}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Main />
)
