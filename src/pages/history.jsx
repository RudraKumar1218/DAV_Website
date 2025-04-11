import { Link } from "react-router-dom";
import { useContext, useRef,useState } from "react";
import { Context } from "../context/context";
import Navbarx from "./navbar";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import db from "../firebase";
import Table from 'react-bootstrap/Table';
import { collection,getDocs,query,where,updateDoc,arrayRemove,deleteDoc} from "firebase/firestore";
export default function History() {
    const [date, setDate] = useState('');
    const [history,setHistory]=useState([]);
    const [curr,setcurr]=useState('');
    const [total,setTotal]=useState(0);
    const handleDateChange = (e) => {
        setDate(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setcurr(date);
          const logsCollection = collection(db, 'logs');
          const q = query(logsCollection, where('date', '==', date));
          const querySnapshot = await getDocs(q);
          const logs = querySnapshot.docs.map(doc => doc.data());
          setHistory(logs);
          const totalFees = logs.reduce((acc, log) => acc + log.feesPaid, 0);
          setTotal(totalFees); 
        } catch (error) {
          console.error('Error fetching logs:', error);
        }
    };
    const handleDelete = async(element) => {
        try {
            const logsRef = collection(db, 'logs');
            const q = query(logsRef, where("receiptNumber", "==", element.receiptNumber));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
            });

            const classCollectionRef = collection(db, element.class);
            const classQuery = query(classCollectionRef, where("rollno", "==", element.rollno));
            const classSnapshot = await getDocs(classQuery);
            classSnapshot.forEach(async (classDoc) => {
                await updateDoc(classDoc.ref, {
                  feehistory: arrayRemove({
                    date: date,
                    receiptNumber: element.receiptNumber,
                    feespaid: element.feesPaid
                  })
                });
            });
            setHistory((prevHistory) => prevHistory.filter(
                (item) => item.receiptNumber !== element.receiptNumber
            ));
        } catch (e) {
            console.error("Error deleting document: ", e);
            alert('Error deleting entry!');
        }
    }
    return (<>
        <Navbarx/>
        <Navbar className="bg-body-tertiary" style={{ marginTop: "50px" }}>
            <Container>
                <Navbar.Brand style={{ fontSize: '2rem' }}>Fees History</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Form className="d-flex">
                    <Form.Control
                    type="date"
                    placeholder="Select Date"
                    className="me-2"
                    aria-label="Search"
                    value={date}
                    onChange={handleDateChange}
                    />
                    <Button variant="outline-success" onClick={handleSubmit}>Search</Button>
                </Form>
                <Navbar.Text style={{ marginLeft:"0.5rem", fontSize: '1.5rem'}}>
                    Total Collected: {total}
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Table striped bordered hover>
            <thead style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                <tr>
                <th className="text-center" style={{ width: '10%' }}>Class</th>
                <th className="text-center" style={{ width: '10%' }}>Roll No.</th>
                <th className="text-center" style={{ width: '22.5%' }}>Name</th>
                <th className="text-center" style={{ width: '22.5%' }}>Father's Name</th>
                <th className="text-center" style={{ width: '17.5%' }}>Recipt Number</th>
                <th className="text-center" style={{ width: '10%' }}>Fees Paid</th>
                <th className="text-center" style={{ width: '7.5%' }}>Delete</th>
                </tr>
            </thead>
            <tbody style={{ fontSize: '1.2rem' }}>
                {history.map((element, index) => (
                    <tr key={index}>
                        <td className="text-center" >{element.class}</td>
                        <td className="text-center" >{element.rollno}</td>
                        <td className="text-center" >{element.studentName}</td>
                        <td className="text-center" >{element.fatherName}</td>
                        <td className="text-center" >{element.receiptNumber}</td>
                        <td className="text-center" >{element.feesPaid}</td>
                        <td className="text-center" onClick={() => handleDelete(element)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20px" height="20px"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></td>
                    </tr>
                ))}
            </tbody>
    </Table>
    </>)
}