import { Link } from "react-router-dom";
import { useContext, useRef,useState } from "react";
import { Context } from "../context/context";
import Navbarx from "./navbar";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import db from '../firebase';
import { doc, getDocs, getDoc, collection,addDoc,arrayUnion,query,where,updateDoc } from "firebase/firestore";
let x=1000;
export default function Admin() {
    const [validated, setValidated] = useState(false);
    const [selectedClass, setSelectedClass] = useState("16");
    const [selectedClass2, setSelectedClass2] = useState("16");
    const [studentone,setStudentone]=useState("1000");
    const [students, setStudents] = useState([]);
    const [fathername,setfathername]=useState("");
    const handleClassChange = async (event) => {
        event.preventDefault();
        const newClass = event.target.value;
        setSelectedClass(newClass);
    };
    const handleClassChange2 = async (event) => {
        event.preventDefault();
        const newClass = event.target.value;
        setSelectedClass2(newClass);
        if (newClass !== "16") {
            const stud = await getDocs(collection(db, newClass));
            const arr = [];
            stud.forEach((doc) => {
                arr.push(doc.data());
            });
            setStudents(arr);
        } else {
            setStudents([]);
            setfathername("");
        }
    };
    const handleStudentChange=async(event)=>{
        event.preventDefault();
        setStudentone(event.target.value);
        const father=students[event.target.value].fatherName;
        setfathername(father);
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(form.elements);
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const selectedClas = selectedClass2; 
            const studentIndex = studentone;
            const receiptNumber = Number(form.elements["validationCustom02-3"].value);
            const feesPaid = Number(form.elements["validationCustom02-4"].value);
            const date = form.elements["validationCustom02-2"].value;
            const selectedStudent = students[studentIndex];
            const rollno=students[studentIndex].rollno;
            const logData = {
                class: selectedClas,
                rollno: rollno,
                studentName: selectedStudent.name,
                fatherName: selectedStudent.fatherName,
                receiptNumber: receiptNumber,
                feesPaid: feesPaid,
                date: date
            };
            try {
                const q = query(collection(db, selectedClas), where('rollno', '==', rollno));
                const querySnapshot = await getDocs(q);
                const newFeeHistoryEntry = {
                    receiptNumber: receiptNumber,
                    date: date,
                    feespaid: feesPaid
                };
                const docSnapshot = querySnapshot.docs[0];
                const studentId = docSnapshot.id;
                const studentDocRef = doc(db, selectedClas, studentId);
                await updateDoc(studentDocRef, {
                    feehistory: arrayUnion(newFeeHistoryEntry)
                });
                await addDoc(collection(db, 'logs'), logData);
                window.location.reload();
            } catch (error) {
                console.error("Error writing document: ", error);
            }
        }
    };

    const [formData, setFormData] = useState({
        rollNo: '',
        name: '',
        fatherName: '',
        phoneNo: '',
        monthlyFees: '',
        concession: ''
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };
      const handleSubmit2 = async (event) => {
        event.preventDefault();
        setValidated(true);
    
        if (event.currentTarget.checkValidity() === false) {
          event.stopPropagation();
          return;
        }
        
        try {
            const name=formData.name;
            const phone=Number(formData.phoneNo)
            const concession=Number(formData.concession)
            const fatherName=formData.fatherName
            const monthlyfee=Number(formData.monthlyFees)
            const rollno=Number(formData.rollNo)
            const feehistory=[]
            const data={
                name,
                phone,
                concession,
                fatherName,
                monthlyfee,
                rollno,
                feehistory
            }
          await addDoc(collection(db, selectedClass),data);
          alert('Student added successfully!');
          window.location.reload();
        } catch (e) {
          console.error("Error adding document: ", e);
          alert('Error adding student!');
        }
      };

    return (<>
        <Navbarx/>
        <Navbar className="bg-body-tertiary" style={{ marginTop: "50px" }}>
                <Container>
                    <Navbar.Brand style={{ fontSize: '2.2rem' }}>Add Payment</Navbar.Brand>
                </Container>
            </Navbar>
            <Form noValidate validated={validated} onSubmit={handleSubmit} >
            <Row className="mb-3">
                <Form.Group as={Col} md="2"  controlId="validationCustom01">
                <Form.Label style={{fontWeight:"bold"}}>Select Class</Form.Label>
                <Form.Select size="lg" aria-label="Default select example" value={selectedClass2} onChange={handleClassChange2} style={{ marginTop: "5px", marginBottom: "10px" }}>
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
                </Form.Group>
                <Form.Group as={Col} md="2"  controlId="validationCustom02">
                <Form.Label style={{fontWeight:"bold"}}>Select Student</Form.Label>
                <Form.Select size="lg" aria-label="Default select example" disabled={selectedClass2 === "16"} readOnly style={{ marginTop: "5px",marginBottom: "10px"  }} onChange={handleStudentChange}>
                    <option value={x}>Select Student</option>
                    {students.map((student, index) => (
                        <option value={index} key={index}>{student.name}</option>
                    ))}
                </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="validationCustom02-1" >
                <Form.Label style={{fontWeight:"bold"}}>Father's Name</Form.Label>
                <Form.Control
                    required
                    disabled
                    type="text"
                    placeholder="Father's Name"
                    value={fathername}
                    style={{
                        marginBottom: "10px"
                    }}
                />
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="validationCustom02-2">
                <Form.Label style={{fontWeight:"bold"}}>Select Date</Form.Label>
                <Form.Control
                    disabled={selectedClass2 === "16"}
                    required
                    type="date"
                    placeholder="Date"
                    style={{
                        marginTop: "5px",
                        marginBottom: "10px" 
                    }}
                    size="lg"
                />
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="validationCustom02-3">
                <Form.Label style={{fontWeight:"bold"}}>Enter Recipt Number</Form.Label>
                <Form.Control
                    disabled={selectedClass2 === "16"}
                    required
                    type="number"
                    style={{
                        marginTop: "5px",
                        marginBottom: "10px" 
                    }}
                    size="lg"
                    placeholder="Recipt No."
                />
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="validationCustom02-4" >
                <Form.Label style={{fontWeight:"bold"}}>Enter Fees Paid</Form.Label>
                <Form.Control
                    disabled={selectedClass2 === "16"}
                    required
                    type="number"
                    placeholder="Fees Paid"
                    style={{
                        marginTop: "5px",
                        marginBottom: "10px" 
                    }}
                    size="lg"
                />
                </Form.Group>
            </Row>
            <Row>
                <Col className="d-flex justify-content-center">
                        <Button
                            disabled={selectedClass2 === "16"}
                            type="submit"
                            style={{
                                width: '20rem',
                            }}
                        >
                            Submit Payment
                        </Button>
                    </Col>
                </Row>
            </Form>
        <Navbar className="bg-body-tertiary" style={{ marginTop: "50px" }}>
            <Container>
                <Navbar.Brand style={{ fontSize: '2.2rem' }}>Add Student</Navbar.Brand>
            </Container>
        </Navbar>
        <Form noValidate validated={validated} onSubmit={handleSubmit2}>
            <Row className="mb-3">
                <Form.Group as={Col} md="2" controlId="validationCustom01">
                <Form.Label style={{fontWeight:"bold"}}>Select Class</Form.Label>
                <Form.Select size="lg" aria-label="Default select example" value={selectedClass} onChange={handleClassChange} style={{ marginTop: "5px", marginBottom: "10px"}}>
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
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="validationCustom02">
                <Form.Label style={{fontWeight:"bold"}}>Roll No.</Form.Label>
                <Form.Control
                    required
                    type="number"
                    placeholder="Roll No."
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    style={{
                        marginTop: "5px",
                        marginBottom: "10px"
                    }}
                    size="lg"
                />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label style={{fontWeight:"bold"}}>Name</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                        marginBottom: "10px"
                    }}
                />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label style={{fontWeight:"bold"}}>Father's Name</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="Father's Name"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    style={{
                        marginBottom: "10px"
                    }}
                />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label style={{fontWeight:"bold"}}>Phone No.</Form.Label>
                <Form.Control
                    required
                    type="number"
                    placeholder="Phone No."
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    style={{
                        marginTop: "5px",
                        marginBottom: "10px"
                    }}
                    size="lg"
                />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label style={{fontWeight:"bold"}}>Monthly Fees</Form.Label>
                <Form.Control
                    required
                    type="number"
                    placeholder="Monthly Fees"
                    name="monthlyFees"
                    value={formData.monthlyFees}
                    onChange={handleChange}
                    style={{
                        marginTop: "5px",
                        marginBottom: "10px"
                    }}
                    size="lg"
                />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label style={{fontWeight:"bold"}}>Concession</Form.Label>
                <Form.Control
                    required
                    type="number"
                    placeholder="Concession"
                    name="concession"
                    value={formData.concession}
                    onChange={handleChange}
                    style={{
                        marginTop: "5px",
                        marginBottom: "10px"
                    }}
                    size="lg"
                />
                </Form.Group>
            </Row>
            <Row>
                <Col className="d-flex justify-content-center">
                        <Button
                            disabled={selectedClass === "16"}
                            type="submit"
                            style={{
                                width: '20rem',
                            }}
                        >
                            Add Student
                        </Button>
                    </Col>
                </Row>
            </Form>
            

    </>)
}