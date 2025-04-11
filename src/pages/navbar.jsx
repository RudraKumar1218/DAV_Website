import React, { useState,useContext } from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Context } from "../context/context";
import { useNavigate } from "react-router-dom";
export default function Navbarx() {
    const {user,dispatch}=useContext(Context);
    const navigate = useNavigate();
    const handlelogout =async(e)=>{
        dispatch({type:"LOGOUT"});
        navigate("/login");
    }
    return (
        <>
        <Navbar bg="dark" data-bs-theme="dark" fixed="top" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/" ><img
              src="https://firebasestorage.googleapis.com/v0/b/fees-history.appspot.com/o/logo-removebg-preview.png?alt=media&token=917f5e74-e85e-4b0d-a3dd-c9b4685bb887"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            /></Navbar.Brand>
            <Nav className="mr-auto">
                    <Nav.Link style={{ fontSize: "1.2rem" }}>Session 2024-25</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="/" style={{ fontSize: "1.3rem"}}>Home</Nav.Link>
                    <Nav.Link href="/leftstudents" style={{ fontSize: "1.3rem"}}>Removed</Nav.Link>
                    {user.Admin && <Nav.Link href="feeshistory" style={{ fontSize: "1.3rem" }}>History</Nav.Link>}
                    {user.Admin && <Nav.Link href="Admin" style={{ fontSize: "1.3rem" }}>Admin</Nav.Link>}
                    <Nav.Link onClick={handlelogout} style={{ fontSize: "1.3rem" }}>Logout</Nav.Link>
                </Nav>
          </Container>
        </Navbar>
      </>
      );
}