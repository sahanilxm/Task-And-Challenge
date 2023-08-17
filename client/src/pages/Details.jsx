import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Conversation from './Conversation';

function Details(props){
    const [details, setDetails] = useState({});
    const [responseMessage, setResponseMessage] = useState('');
    const [userLogin, setUserLogin] = useState('');

    const navigateTo = useNavigate();

    const formattedDate= (date) =>{
        const dateToFormat= new Date(date);
        const formattedDate = `${dateToFormat.getDate().toString().padStart(2, '0')}/${(dateToFormat.getMonth()+1).toString().padStart(2, '0')}/${dateToFormat.getFullYear()} ${dateToFormat.getHours().toString().padStart(2, '0')}:${dateToFormat.getMinutes().toString().padStart(2, '0')}:${dateToFormat.getSeconds().toString().padStart(2, '0')}`;
        return formattedDate;
    }

    const handleDelete= async () =>{
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/handleStateChange/delete',{
            challengeId: details._id,
        },{headers: {'Authorization': `Bearer ${token}`}}
        ).then((response)=> {
            if (response.status === 200) {
                props.setSubPage(0)
            }
        }).catch((error) =>{
            if (error.response && error.response.status === 401) {
                navigateTo('../notlogged');
            } else if (error.response && error.response.status === 500) {
                console.log(error);
            }
        });
    }
    const handleToVerification= async () =>{
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/handleStateChange/toVerification',{
            challengeId: details._id,
        },{headers: {'Authorization': `Bearer ${token}`}}
        ).then((response)=> {
            if (response.status === 200) {
                getDetails(props.id);
            }
        }).catch((error) =>{
            if (error.response && error.response.status === 401) {
                navigateTo('../notlogged');
            } else if (error.response && error.response.status === 500) {
                console.log(error);
            }
        });
    }
    const handleCancel = async () => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/handleStateChange/cancel',{
            challengeId: details._id,
        },{headers: {'Authorization': `Bearer ${token}`}}
        ).then((response)=> {
            if (response.status === 200) {
                getDetails(props.id);
            }
        }).catch((error) =>{
            if (error.response && error.response.status === 401) {
                navigateTo('../notlogged');
            } else if (error.response && error.response.status === 500) {
                console.log(error);
            }
        });
    }
    const handleUnclaim = async () => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/handleStateChange/unclaim',{
            challengeId: details._id,
        },{headers: {'Authorization': `Bearer ${token}`}}
        ).then((response)=> {
            if (response.status === 200) {
                props.setSubPage(0)
            }
        }).catch((error) =>{
            if (error.response && error.response.status === 401) {
                navigateTo('../notlogged');
            } else if (error.response && error.response.status === 500) {
                console.log(error);
            }
        });
    }
    const handleVerify = async (option) => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/handleStateChange/verify',{
            challengeId: details._id,
            option: option
        },{headers: {'Authorization': `Bearer ${token}`}}
        ).then((response)=> {
            if (response.status === 200) {
                getDetails(props.id);
            }
        }).catch((error) =>{
            if (error.response && error.response.status === 401) {
                navigateTo('../notlogged');
            } else if (error.response && error.response.status === 500) {
                console.log(error);
            } else if (error.response && error.response.status === 410) { //user not found
                console.log(error);
            }
        });
    }
    const getDetails= async (id) => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/details',{id: id},
        {headers: {'Authorization': `Bearer ${token}`}}
        ).then((response) => {
        //if user is logged in and there are no errors
        if (response.status === 207) {
            setDetails(response.data.challenge);
            setUserLogin(response.data.login)
        }
        }).catch((error) =>{
        //if user is not authorized
        if (error.response && error.response.status === 401) {
            navigateTo('../notlogged');
        } 
        else if (error.response && error.response.status === 410) {
            setResponseMessage('No challenge or user found');
        }
        else if (error.response && error.response.status === 500) {
            setResponseMessage('Internal server error');
        }
    });
    }
    useEffect(()=>{
        getDetails(props.id);
    }, []);

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <Row>
                    <Col xs={4} md={3} className='d-flex justify-content-start align-items-end ms-2'>
                        <Button onClick={()=>props.setSubPage(0)} className='border border-3 border-secondary-subtle' variant='light'><i className='bi-arrow-left'></i> Go back</Button>
                    </Col>
                    <Col xs={4} md={6} className='d-flex justify-content-center'>
                        <div className='text-center mt-3'>
                            <h2>Challenge details</h2>
                        </div>
                    </Col>
                </Row>

                <Col className='m-3 p-4 border border-5 border-light rounded'>
                    <Tabs
                        defaultActiveKey="details"
                        id="details-tab"
                        className="mb-3"
                        justify
                    >
                        <Tab eventKey="details" title="Details">
                            <Container className='pt-3'>
                                <h3>{details.title}</h3>
                                <h6 className='text-muted'>Author: {details.author}</h6>
                                <p>{details.details}</p>

                                <Row className='text-muted'>
                                    <Col>
                                        <p>Start date: {formattedDate(details.startDate)}</p>
                                    </Col>
                                    <Col>
                                        <p className='float-end'>End date: {formattedDate(details.endDate)}</p>
                                    </Col>
                                </Row>

                                <Row className='text-muted'>
                                    <Col>
                                        <p>Reward: {details.points}</p>
                                    </Col>
                                    <Col>
                                        <p className='float-end'>
                                            State:
                                            {details.challengeState === 0 ? 
                                                ' Available': 
                                            details.challengeState === 1 ? 
                                                ' Claimed' : 
                                            details.challengeState === 2 ? 
                                                ' Pending' :
                                            details.challengeState === 3 ? 
                                                ' Finished' : 
                                                ' Expired'
                                            }
                                        </p>
                                    </Col>
                                </Row>

                                {(details.acceptedBy != '' && details.acceptedBy != null) && 
                                    <p className='text-muted'>Claimed By: {details.acceptedBy}</p>
                                }

                                <Row>
                                    {(details.author === userLogin && details.challengeState === 2) ? 
                                        <ButtonGroup>
                                            <Button onClick={()=>{handleVerify(true)}} className='w-100 mb-3' variant='success'>Accept</Button>
                                            <Button onClick={()=>{handleVerify(false)}} className='w-100 mb-3' variant='danger'>Don't accept</Button>
                                        </ButtonGroup>
                                    : (details.acceptedBy === userLogin && details.challengeState === 1) ? 
                                        <Col>
                                            <Button onClick={()=>{handleToVerification()}} className='w-100' variant='primary'>Send for verification</Button> 
                                        </Col>
                                    : (details.acceptedBy === userLogin && details.challengeState === 2) && 
                                        <Button onClick={()=>{handleCancel()}} className='w-100 border border-3 border-secondary-subtle' variant='light'>Cancel</Button>
                                    }

                                    {(details.author === userLogin && details.challengeState !== 3) ? 
                                        <Col>
                                            <Button onClick={()=>{handleDelete()}} className='w-100' variant='outline-danger'>Delete challenge</Button>
                                        </Col>
                                    : (details.acceptedBy === userLogin && details.challengeState === 1) && 
                                        <Col>
                                            <Button onClick={()=>{handleUnclaim()}} className='w-100 border border-3 border-secondary-subtle' variant='light'>Unclaim</Button>
                                        </Col>
                                    }
                                </Row>          

                                <div className='text-center'>
                                    {responseMessage != '' && 
                                        <p className='text-danger'>{responseMessage}</p>
                                    }
                                </div>
                            </Container>
                        </Tab>
                        <Tab eventKey="conv" title="Conversation">
                            <Conversation challengeId={props.id} acceptedBy={details.acceptedBy} userLogin={userLogin}/>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    )
}

export default Details;