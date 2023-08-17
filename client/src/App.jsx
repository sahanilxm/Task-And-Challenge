import {BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Main from './pages/Main'; //list of challenges, details about challenges and conversations
import Login from './pages/Login'; //login form
import Register from './pages/Register'; //registration form
import NotLogged from './pages/notLogged'; //this page displays, when you are not authorized to be somewhere
import NotAdmin from './pages/notAdmin';
import AddNewChallenge from './pages/AddNewChallenge'; //form for adding new challenges
import User from './pages/User'; //details about user, changing password, deleting account and logging out
import AdminPanel from './pages/AdminPanel'; //admin panel for admins only

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/notlogged" element={<NotLogged />}/>
        <Route path="/notadmin" element={<NotAdmin />}/>
        <Route path="/addNewChallenge" element={<AddNewChallenge />}/>
        <Route path="/user" element={<User />}/>
        <Route path="/adminPanel" element={<AdminPanel />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
