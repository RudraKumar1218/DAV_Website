import { Link } from "react-router-dom";
import { useContext, useRef, useState, useEffect, createRef } from "react";
import { Context } from "../context/context";
import Navbarx from "./navbar";
import db from '../firebase';
import { doc, getDocs,collection,query, where,updateDoc,setDoc,deleteDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
let x=1000;

const nameRef=createRef();
const rollnoRef=createRef();
const phoneRef=createRef();
const fatherRef=createRef();
const monthlyRef=createRef();
const concessionRef=createRef();
export default function Home() {
    const {user}=useContext(Context);
    const [selectedClass, setSelectedClass] = useState("16"); // Initial state
    const [students, setStudents] = useState([]);
    const [studentone,setStudentone]=useState("1000");
    const [display,setDisplay]=useState([]);
    const [visclass,setvisClass]=useState("16");
    const [balance,setbalance]=useState(0);
    const navigate = useNavigate();
    const handleClassChange = async (event) => {
        event.preventDefault();
        const newClass = event.target.value;
        setSelectedClass(newClass);

        if (newClass !== "16") {
            const stud = await getDocs(collection(db, newClass));
            const arr = [];
            stud.forEach((doc) => {
                arr.push(doc.data());
            });
            setStudents(arr);
        } else {
            setStudents([]);
        }
    };
    const handleStudentChange=async(event)=>{
        event.preventDefault();
        setStudentone(event.target.value);
    }

    const handleSubmit=async(event)=>{
        event.preventDefault();
        setvisClass(selectedClass);
        console.log(studentone);
        var l=studentone;
        if(l==="1000"){
            setDisplay(students);
        }
        else{
            const arr=[];
            arr.push(students[studentone]);
            setDisplay(arr);
        }
    }

    const handleViewDetails = (student) => {
        student.class=visclass;
        navigate("/student", { state: { student } });
    };

    useEffect(() => {
        console.log(selectedClass);
    }, [selectedClass]);

    useEffect(() => {
        console.log(display);
    }, [display]);

    useEffect(() => {
        console.log(studentone);
    }, [studentone]);

    function monthDiff(date1, date2) {
        const year1 = date1.getFullYear();
        const month1 = date1.getMonth();
        const year2 = date2.getFullYear();
        const month2 = date2.getMonth();
      
        const yearDiff = year2 - year1;
        const monthDiff = month2 - month1;
      
        return yearDiff * 12 + monthDiff;
    }
    const calculateBalanceColor = (student) => {
        const balance = calculate(student);
        return balance < 0 ? 'red' : 'green';
    };
    const calculate = (student) => {
        const date1 = new Date('2024-04-01');
        const date2 = new Date();
        const differenceInMonths = monthDiff(date1, date2);
        var x=0;
        (student.feehistory).forEach(element => {
            x=x+element.feespaid;
        });
        const balanced=x-((student.monthlyfee-student.concession)*differenceInMonths);
        return balanced;
    };
        useEffect(() => {
            console.log(display);
            let totalBalance = 0;
            display.forEach(student => {
                totalBalance += calculate(student);
            });
            setbalance(totalBalance);
        }, [display]);

        const [studentupdate,setstudentupdate]=useState({});
        const [showupdate, setShowUpdate] = useState(false);
        const handleCloseUpdate = () => {
            setShowUpdate(false);
            setstudentupdate({});
        };
        const handleShowUpdate = async(student) => {
            setShowUpdate(true)
            setstudentupdate(student);
        };
        const handleSubmitUpdate =async(e)=>{
            e.preventDefault();
            const name=nameRef.current.value;
            const rollno=Number(rollnoRef.current.value);
            const fatherName=fatherRef.current.value;
            const phone=Number(phoneRef.current.value);
            const monthlyfee=Number(monthlyRef.current.value);
            const concession=Number(concessionRef.current.value);
            const updateData = {
                name,
                rollno,
                fatherName,
                phone,
                monthlyfee,
                concession
            };
            try{
                console.log(rollno);
                console.log(visclass);
                const q = query(collection(db, visclass), where('rollno', '==', rollno));
                const querySnapshot = await getDocs(q); 
                if (!querySnapshot.empty) {
                    const docSnapshot = querySnapshot.docs[0];
                    const docRef = doc(db, visclass, docSnapshot.id);
                    await updateDoc(docRef, updateData);
                    console.log("Document updated successfully");
                } else {
                    console.log("No document found with the specified rollno");
                }
            } catch (error) {
                console.error("Error updating document: ", error);
            }
            handleCloseUpdate();
            window.location.reload();
        }

        const [show,setShow]=useState(false);
        const [delstudent,setdelstudent]=useState("");
        const handleShowDelete = async(student) => {
            setdelstudent(student);
            setShow(true);
        };
        const handleCloseDelete=async() => {
            setdelstudent({});
            setShow(false);
        };
        const getCurrentDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const handleDelete =async(e)=>{
            e.preventDefault();
            const rollno=Number(delstudent.rollno);
            console.log(rollno);
            try {
                const q = query(collection(db, visclass), where('rollno', '==', rollno));
                const querySnapshot = await getDocs(q);
        
                if (!querySnapshot.empty) {
                    const docSnapshot = querySnapshot.docs[0];
                    const docData = docSnapshot.data();
                    const docId = docSnapshot.id;
        
                    const removedDocRef = doc(db, 'removed', docId);
                    const date=getCurrentDate();
                    await setDoc(removedDocRef, {
                        ...docData,
                        class: visclass,
                        dateremoved:date 
                    });
                    const originalDocRef = doc(db, visclass, docId);
                    await deleteDoc(originalDocRef);
        
                    console.log("Document moved to 'removed' collection and deleted from the original collection successfully");
                } else {
                    console.log("No document found with the specified rollno");
                }
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
            handleCloseDelete();
            window.location.reload();
        }

            const handleCopyClick = (textToCopy) => {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert('Text copied to clipboard!');
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                });
            };

    return (
        <>
            <Navbarx />
            {/* <Navbar className="bg-body-tertiary" >
                <Container>
                    <Navbar.Brand style={{ fontSize: '2.2rem' }}>Class Details</Navbar.Brand>
                </Container>
            </Navbar> */}
            <Navbar className="bg-body-tertiary" style={{ marginTop: "50px" }}>
            <Container>
                <Navbar.Brand style={{ fontSize: '2.5rem' }}>Class Detail</Navbar.Brand>
                <Navbar.Toggle />
                 <Navbar.Collapse className="justify-content-end">
                <Navbar.Text style={{ fontSize: '2.5rem', color: balance < 0 ? 'red' : 'green' }}>
                    Balance: {balance}
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
            </Navbar>
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
            <Form.Select size="lg" aria-label="Default select example" disabled={selectedClass === "16"} readOnly style={{ marginTop: "10px" }} onChange={handleStudentChange}>
                <option value={x}>Select Student</option>
                {students.map((student, index) => (
                    <option value={index} key={index}>{student.name}</option>
                ))}
            </Form.Select>
            <div className="d-grid gap-2">
                <Button variant="primary" size="lg" disabled={selectedClass === "16"} onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
             <Container>
                <Row className="justify-content-center">
                    {display.map((student, index) => (
                        <Col key={index} xs={12} sm={10} md={8} lg={6} xl={4} className="mb-4">
                            <Card style={{ width: '100%' }}>
                                <Card.Body>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Card.Title style={{fontWeight:"bold"}}>{student.name}</Card.Title>
                                        <Card.Title style={{ color: calculateBalanceColor(student) }}>
                                            Balance: {calculate(student)}
                                        </Card.Title>
                                    </div>
                                    <Card.Text style={{fontWeight:"bold"}}>
                                        Father's Name: {student.fatherName} <br/> Phone No: {student.phone} <span onClick={() => handleCopyClick(student.phone)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="10px" width="10px"><path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg></span>
                                    </Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item style={{fontWeight:"bold"}}>Monthly Fees: {student.monthlyfee} </ListGroup.Item>
                                    <ListGroup.Item style={{fontWeight:"bold"}}>Concession: {student.concession}</ListGroup.Item>
                                    <ListGroup.Item style={{fontWeight:"bold"}}>Payable Fees: {student.monthlyfee - student.concession}</ListGroup.Item>
                                </ListGroup>
                                <Card.Body>
                                    <Button variant="primary" onClick={() => handleViewDetails(student)}>View Details</Button>
                                    {user.Admin ? <Button variant="secondary" onClick={() => handleShowUpdate(student)} style={{marginLeft:"1rem"}}>Update</Button>:<></>}
                                    {user.Admin ? <Button variant="danger" onClick={() => handleShowDelete(student)} style={{marginLeft:"1rem"}}>Delete</Button> :<></>}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Modal show={showupdate} onHide={handleCloseUpdate}>
                <Modal.Header closeButton>
                <Modal.Title>Update Student Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="textarea"
                        autoFocus
                        rows={1}
                        defaultValue={studentupdate.name}
                        ref={nameRef}
                    />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Father's Name</Form.Label>
                    <Form.Control
                        type="textarea"
                        rows={1}
                        defaultValue={studentupdate.fatherName}
                        ref={fatherRef}
                    />
                    </Form.Group>

                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <Form.Label>Roll No.</Form.Label>
                    <Form.Control as="textarea" type="number" disabled rows={1} defaultValue={studentupdate.rollno} ref={rollnoRef}/>
                    </Form.Group>

                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control as="textarea" type="number" rows={1} defaultValue={studentupdate.phone} ref={phoneRef}/>
                    </Form.Group>

                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <Form.Label>Monthly Fees</Form.Label>
                    <Form.Control as="textarea" type="number" rows={1} defaultValue={studentupdate.monthlyfee} ref={monthlyRef}/>
                    </Form.Group>

                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <Form.Label>Concession</Form.Label>
                    <Form.Control as="textarea" type="number" rows={1} defaultValue={studentupdate.concession} ref={concessionRef}/>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseUpdate}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmitUpdate}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>
    {/* delete Student         */}

        <Modal show={show} onHide={handleCloseDelete}>
            <Modal.Header closeButton>
            <Modal.Title>Delete Student</Modal.Title>
            </Modal.Header>
            <Modal.Body>Student Will be Moved to Removed Section</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
                Close
            </Button>
            <Button variant="danger" onClick={handleDelete}>
                Delete
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}
