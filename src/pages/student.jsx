import React, {useState,useContext,useEffect,createRef} from "react";
import { useLocation } from "react-router-dom"
import { Context } from "../context/context";
import Navbarx from "./navbar";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
export default function Student(){
    const itemStyle = {
        fontSize: '1.5rem', // Adjust this value to make the font size larger
      };
      const headingStyle = {
        fontWeight: 'bold',
      };
      const headingStyle2 = {
        fontSize: '15px',
        fontWeight: 'bold',
      };
      const feesPaidStyle = {
        fontSize: '12px',
      };
        const entryStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
        };
    const location = useLocation();
    const { student } = location.state || {}; // Destructure student from state
    const [data,setData]=useState({});
    const [feespaid,setfeespaid]=useState(0);
    const [months,setmonths]=useState(0);
    function monthDiff(date1, date2) {
        const year1 = date1.getFullYear();
        const month1 = date1.getMonth();
        const year2 = date2.getFullYear();
        const month2 = date2.getMonth();
      
        const yearDiff = year2 - year1;
        const monthDiff = month2 - month1;
      
        return yearDiff * 12 + monthDiff;
    }
    useEffect(() => {
        setData(student);
        var x=0;
        (student.feehistory).forEach(element => {
            x=x+element.feespaid;
        });
        setfeespaid(x);
        const date1 = new Date('2024-04-01');
        const date2 = new Date();
        const differenceInMonths = monthDiff(date1, date2);
        setmonths(differenceInMonths);
    }, []);
    useEffect(() => {
        console.log(data);
    }, [data]);
    return (
        <div>
            <Navbarx/>
            <Navbar className="bg-body-tertiary" style={{ marginTop: "50px" }}>
            <Container>
                <Navbar.Brand style={{ fontSize: '2.5rem' }}>Student's Detail</Navbar.Brand>
                <Navbar.Toggle />
                {data ? ( <Navbar.Collapse className="justify-content-end">
                <Navbar.Text style={{ fontSize: '2.5rem', color: feespaid-(months*(student.monthlyfee - student.concession)) < 0 ? 'red' : 'green' }}>
                    Balance: {feespaid-(months*(student.monthlyfee - student.concession))}
                </Navbar.Text>
                </Navbar.Collapse>):<></>}
            </Container>
            </Navbar>

            {/* <Navbar bg="light" data-bs-theme="light" style={{ marginTop: "50px" }}>
            <Container>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Navbar.Brand style={{ fontSize: '30px' }}>Student's Detail</Navbar.Brand>
                    {data && (
                    <Navbar.Brand style={{ fontSize: '30px', color: student.monthlyfee - student.concession < 0 ? 'red' : 'green' }}>
                        Balance: {student.monthlyfee - student.concession}
                    </Navbar.Brand>
                    )}
                </div>
            </Container>
            </Navbar> */}
            {data ? (
                <>
                    <ListGroup>
                        <ListGroup.Item style={itemStyle}>
                            <span style={headingStyle}>Roll No:</span> {data.rollno}
                        </ListGroup.Item>
                        <ListGroup.Item style={itemStyle}>
                            <span style={headingStyle}>Class:</span> {data.class}
                        </ListGroup.Item>
                        <ListGroup.Item style={itemStyle}>
                            <span style={headingStyle}>Name:</span> {data.name}
                        </ListGroup.Item>
                        <ListGroup.Item style={itemStyle}>
                            <span style={headingStyle}>Father's Name:</span> {data.fatherName}
                        </ListGroup.Item>
                        <ListGroup.Item style={itemStyle}>
                            <span style={headingStyle}>Mobile Number:</span> {data.phone}
                        </ListGroup.Item>
                        <ListGroup.Item style={itemStyle}>
                            <span style={headingStyle}>Annual Fees:</span> {data.monthlyfee*12}
                        </ListGroup.Item>
                        <ListGroup.Item style={itemStyle}>
                            <span style={headingStyle}>Concession:</span> {data.concession*12}
                        </ListGroup.Item>
                        <ListGroup.Item style={itemStyle}>
                            <span style={headingStyle}>Payable Annual Fees:</span> {(data.monthlyfee-data.concession)*12}
                        </ListGroup.Item>
                        <ListGroup.Item style={itemStyle}>
                            <span style={headingStyle}>Payable Monthly Fees:</span> {(data.monthlyfee-data.concession)}
                        </ListGroup.Item>
                    </ListGroup>
                    <Accordion>
                        <Accordion.Item eventKey="0" style={itemStyle}>
                            <Accordion.Header>
                            <span style={headingStyle2}>Fees Paid:₹</span>
                            <span style={feesPaidStyle}>{feespaid}</span>
                            </Accordion.Header>
                            <Accordion.Body>
                            <ListGroup>
                                {student.feehistory.map((element, index) => (
                                    <ListGroup.Item key={index} style={entryStyle}>
                                    <span style={{fontWeight:"bold", fontSize:"1.3rem"}}>Date: {element.date}</span>
                                    <span style={{fontWeight:"bold", fontSize:"1.3rem"}}>Fees Paid: {element.feespaid}</span>
                                    <span style={{fontWeight:"bold", fontSize:"1.3rem"}}>Recipt No: {element.receiptNumber}</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </>

            ) : (
                <p>No student details available</p>
            )}
        </div>
    );
}

