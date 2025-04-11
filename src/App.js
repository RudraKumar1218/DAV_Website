import './App.css';
import React, { useContext } from 'react'
import { BrowserRouter as Router,
  Routes,Route } from 'react-router-dom';
import { Context } from './context/context';
import Home from './pages/home';
import Admin from './pages/admin';
import Login from './pages/login';
import Student from './pages/student';
import History from './pages/history';
import Removed from './pages/removed';
function App() {
  const {user}=useContext(Context);
  return (
    <div className="App">
        <Router>
        <Routes>
            <Route path="/" element={user?<><Home/></>:<Login />} />
            <Route path="/Admin" element={user && user.Admin?<><Admin/></>:<Home/>} />
            <Route path="/login" element={user?<Home/>:<Login />} />
            <Route path="/student" element={user?<Student/>:<Login />}/>
            <Route path="/leftstudents" element={user?<Removed/>:<Login />}/>
            <Route path="/feeshistory" element={user && user.Admin?<History/>:<Home />}/>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
