import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function AddNewChallenge() {
    const [user, setUser] = useState([]);
    const [titleController, setTitleController] = useState('');
    const [detailsController, setDetailsController] = useState('');
    const [endDateController, setEndDateController] = useState('');
    const [pointsController, setPointsController] = useState(20);
    const [pointsWarning, setPointsWarning] = useState('');
    const [validated, setValidated] = useState(false);


    const navigateTo = useNavigate();

    const getUserName = async () => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/getUserFromId',null,{headers: {'Authorization': `Bearer ${token}`}}).then((response) => {
        if (response.status === 207) {
            setUser([response.data.userId,response.data.login,response.data.karma]);
        }
        }).catch(error =>{
            //if user is not authorized
            if (error.response && error.response.status === 401) {
            navigateTo('../notlogged');
        } 
        else if (error.response && error.response.status === 500) {
            console.log(error);
        }
    });
    }
    const pointsChange = (event) => {
        //need fix
        setPointsController(event.target.value);
        if(user[2] <= pointsController-20){
            setPointsWarning('Value bigger than your karma minus 20')
        }
        else{
            setPointsWarning('')
        }
    }
    const handleSubmit = async (event) => {
        // form validation
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }
        setValidated(true);
        event.preventDefault();
        const token = localStorage.getItem('accessToken');

        if(user[2] >= pointsController-20){
            await axios.post('http://localhost:5000/api/addNewChallenge', {
                author: user[1],
                title: titleController,
                details: detailsController,
                endDate: endDateController,
                points: pointsController
            },{headers: {'Authorization': `Bearer ${token}`}}).then(response => {
                if (response.status === 201) {
                    navigateTo('../');
                }
            }).catch(error => {
                if (error.response && error.response.status === 410) {
                    setResponseMessage('No user found');
                } 
                else if (error.response && error.response.status === 300) {
                    setResponseMessage('Wrong password');
                }
                else if (error.response && error.response.status === 422) {
                    setResponseMessage('You don\'t have enough karma');
                }
                else {
                console.log(error);
                }
            });
        }
        else{
            //error when user hasn't got this many points
            setResponseMessage('You don\'t have enough karma');
        }
    }
    useEffect(()=>{
        getUserName();
    }, []);

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <Row>
                    <Col xs={4} md={3} className='d-flex justify-content-start align-items-end ms-2'>
                        <Button onClick={()=>{navigateTo('../')}} className='border border-3 border-secondary-subtle' variant='light'><i className='bi-arrow-left'></i> Go back</Button>
                    </Col>
                    <Col xs={4} md={6} className='d-flex justify-content-center'>
                        <div className='text-center'>
                            <h2>Add a new challenge</h2>
                            <Form.Text className='fw-bold'>Karma of user {user[1]}: {user[2]}</Form.Text>
                        </div>
                    </Col>
                </Row>

                <Col className='m-3 p-4 border border-5 border-light rounded'>
                    <Form noValidate validated={validated} onSubmit={(event) => handleSubmit(event)}>

                        <Form.Group className='mb-3' controlId='formTitle'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                value={titleController} 
                                onChange={event => setTitleController(event.target.value)} 
                                type='text' 
                                placeholder='Enter title' 
                                maxLength={200}
                                required 
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid title.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='formDetails'>
                            <Form.Label>Details</Form.Label>
                            <Form.Control 
                                as='textarea'
                                rows={5}
                                value={detailsController} 
                                onChange={event => setDetailsController(event.target.value)}
                                type='text' 
                                placeholder='Write a detailed explanation of the task...' 
                                maxLength={2000}
                                required 
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide details.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className='mb-3' controlId='formFinishDate'>
                                    <Form.Label>Finish date</Form.Label>
                                    <Form.Control 
                                        type="datetime-local" 
                                        value={endDateController} 
                                        onChange={event => setEndDateController(event.target.value)} 
                                        required 
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a finish date. Don't forget to specify time.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className='mb-3' controlId='formRewardPoints'>
                                    <Form.Label>Reward</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        min={0}
                                        value={pointsController} 
                                        onChange={event => pointsChange(event)}
                                        required 
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid number of reward points.
                                    </Form.Control.Feedback>
                                    <Form.Text className='text-warning'>
                                        {pointsWarning}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button className='w-100' variant='success' type='submit'>
                            Add challenge
                        </Button>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default AddNewChallenge;