import db from '../firebase';
import Navbar from 'react-bootstrap/Navbar';
import Navbarx from "./navbar";
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { getDocs,collection,query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Table } from 'react-bootstrap';
export default function Removed() {
    const [selectedClass, setSelectedClass] = useState("16");
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const handleClassChange = async (event) => {
        event.preventDefault();
        const newClass = event.target.value;
        setSelectedClass(newClass);
    };
    const handleSubmit=async(event)=>{
        console.log(selectedClass);
        event.preventDefault();
        try {
            const removedRef = collection(db, 'removed');
            const q = query(removedRef, where("class", "==", selectedClass));
            const querySnapshot = await getDocs(q);
            console.log("here");
            const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    };
    const calculate = (e) => {
        var x=0;
        (e.feehistory).forEach(ele => {
            x=x+ele.feespaid;
        });
        return x;
    };
    const handleView = (student) => {
        navigate("/student", { state: { student } });
    };
    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <>
            <Navbarx />
            <Navbar className="bg-body-tertiary" style={{ marginTop: "50px" }}>
            <Container>
                <Navbar.Brand style={{ fontSize: '2.2rem' }}>Removed Students</Navbar.Brand>
                <Navbar.Toggle />
                 <Navbar.Collapse className="justify-content-end">
                    <Form.Select size="lg" aria-label="Default select example" value={selectedClass} onChange={handleClassChange}>
                        <option value="16">Select Class</option>
                        <option value="PreNry">PreNry</option>
                        <option value="Nry">Nry</option>
                        <option value="KGA">KGA</option>
                        <option value="KGB">KGB</option>
                        <option value="1st">First</option>
                        <option value="2nd">Second</option>
                        <option value="3rd">Third</option>
                        <option value="4th">Fourth</option>
                        <option value="5th">Fifth</option>
                        <option value="6th">Sixth</option>
                        <option value="7th">Seventh</option>
                        <option value="8th">Eighth</option>
                        <option value="9th">Ninth</option>
                        <option value="10th">Tenth</option>
                        <option value="11th">Eleventh</option>
                        <option value="12th">Twelfth</option>
                    </Form.Select>
                    <Button variant="primary" size="lg" disabled={selectedClass === "16"} onClick={handleSubmit} style={{ marginLeft: '0.3rem' }} >
                        Submit
                    </Button>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        <Table striped bordered hover>
            <thead style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                <tr>
                <th className="text-center" style={{ width: '10%' }}>Date Removed</th>
                <th className="text-center" style={{ width: '10%' }}>Roll No.</th>
                <th className="text-center" style={{ width: '22.5%' }}>Name</th>
                <th className="text-center" style={{ width: '22.5%' }}>Father's Name</th>
                <th className="text-center" style={{ width: '13.75%' }}>Payable Fees</th>
                <th className="text-center" style={{ width: '13.75%' }}>Fees Paid</th>
                <th className="text-center" style={{ width: '7.5%' }}>View Details</th>
                </tr>
            </thead>
            <tbody style={{ fontSize: '1.2rem' }}>
                {data.map((element, index) => (
                    <tr key={index}>
                        <td className="text-center" >{element.dateremoved}</td>
                        <td className="text-center" >{element.rollno}</td>
                        <td className="text-center" >{element.name}</td>
                        <td className="text-center" >{element.fatherName}</td>
                        <td className="text-center" >{element.monthlyfee-element.concession}</td>
                        <td className="text-center" >{calculate(element)}</td>
                        <td className="text-center" onClick={() => handleView(element)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20px" height="20px" ><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg></td>
                    </tr>
                ))}
            </tbody>
    </Table>
        </>
    )
}