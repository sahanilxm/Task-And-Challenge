import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Details from './Details';
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import '../custom.css';

function Element(props){
  const user = props.user;
  const challenge = props.challenge;
  return (
    <Card className='my-3'>
      <Card.Body>
        <Card.Title>{challenge.title}</Card.Title>
        <Row>
          <Col>
            <Card.Subtitle className="mb-2 text-muted">Author: {challenge.author}</Card.Subtitle>
          </Col>
          <Col className='d-flex justify-content-end'>
            <Card.Subtitle className="text-muted mb-2">Reward: {challenge.points}</Card.Subtitle>
          </Col>
        </Row>
        <Card.Text className='max-lines-2'>
          {challenge.details}
        </Card.Text>
        <Row>
          <Col>
            {(challenge.acceptedBy != null && challenge.acceptedBy != '') && // could be simplified, both null and '' return false
              <Card.Subtitle className="text-muted mb-2">Claimed by: {challenge.acceptedBy}</Card.Subtitle>
            }
            {challenge.challengeState === 3 ? 
              <h6 className='text-primary'>Finished</h6>
            : challenge.challengeState === 4 && 
              <h6 className='text-danger'>Expired</h6>
            }
          </Col>
          <Col className='d-flex justify-content-end align-items-end'>
            {(challenge.challengeState === 0 && challenge.author != user[1]) ?
              <Button onClick={() => props.handleClaim(challenge)} variant='success'>Claim</Button>
            : (challenge.author === user[1] || challenge.acceptedBy === user[1]) && 
              <Button onClick={() => props.handleChangeState(challenge._id)} variant='success'>View details</Button>
            }
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

function ShowChallenges(props){
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState([]);
  const [expiredVisible, setExpiredVisible] = useState(false);
  const [finishedVisible, setFinishedVisible] = useState(true);

  const navigateTo = useNavigate();

  //various options for showing challenges depending on which tab will user click
  const all = challenges.filter((challenge) => {
    if(!expiredVisible){
      if(finishedVisible){
        return challenge.challengeState != 4;
      }
      return challenge.challengeState != 4 && challenge.challengeState != 3;
    }
    else{
      if(finishedVisible){
        return challenge;
      }
      return challenge.challengeState != 3;
    }
  });
  const yours = challenges.filter((challenge) =>{
    if(expiredVisible){
      if(finishedVisible){
        return challenge.author === user[1];
      }
      return challenge.author === user[1] && challenge.challengeState != 3;
    }
    else{
      if(finishedVisible){
        return challenge.author === user[1] && challenge.challengeState != 4;
      }
      return challenge.author === user[1] && challenge.challengeState != 4 && challenge.challengeState != 3;
    }
  });
  const claimed = challenges.filter((challenge) =>{
    if(expiredVisible){
      if(finishedVisible){
        return challenge.acceptedBy === user[1] 
      }
      return challenge.acceptedBy === user[1] && challenge.challengeState != 3;
    }
    else{
      if(finishedVisible){
        return challenge.acceptedBy === user[1] && challenge.challengeState != 4;
      }
      return challenge.acceptedBy === user[1] && challenge.challengeState != 4 && challenge.challengeState != 3;
    }
  });
  const available = challenges.filter(challenge =>{
      return challenge.challengeState === 0;
  });
  const handleClaim = async (challenge) => {
    const token = localStorage.getItem('accessToken');
    await axios.post('http://localhost:5000/api/handleStateChange/claim',{
      challengeId: challenge._id,
      userLogin: user[1]
    },{headers: {'Authorization': `Bearer ${token}`}}
    ).then((response)=> {
      if (response.status === 202) {
        getChallenges();
      }
    }).catch((error) =>{
      if (error.response && error.response.status === 401) {
        navigateTo('../notlogged');
      } else if (error.response && error.response.status === 500) {
        console.log(error);
       }
    });
  }
  const getChallenges = async () => {
    const token = localStorage.getItem('accessToken');
    await axios.post('http://localhost:5000/api/showChallenges',null,
      {headers: {'Authorization': `Bearer ${token}`}}
    ).then((response) => {
      //if user is logged in and there are no errors
      if (response.status === 207) {
        setChallenges(response.data.tasks);
        getUser(response.data.userId);
      }
    }).catch((error) =>{
      //if user is not authorized
      if (error.response && error.response.status === 401) {
        navigateTo('../notlogged');
      } 
      else if (error.response && error.response.status === 500) {
       console.log(error);
      }
    });
  };
  const getUser = async () => {
    const token = localStorage.getItem('accessToken');
    await axios.post('http://localhost:5000/api/getUserFromId',null,{headers: {'Authorization': `Bearer ${token}`}}).then((response) => {
      if (response.status === 207) {
        setUser([response.data.userId,response.data.login,response.data.isAdmin]);
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
  useEffect(()=>{
    getChallenges();
  }, []);

  return (
    <>
      <Navbar sticky='top' expand='md' className='border-bottom border-3 border-secondary-subtle' bg='light' variant='light'>
        <Container>
          <Navbar.Brand className='mx-auto'>Tasks and Challenges</Navbar.Brand>
          <Navbar.Collapse className='d-flex' id="navbar-nav">
            <Nav className='me-auto ms-2'>
              <Nav.Link onClick={()=> {navigateTo('../User')}}>Logged in as: {user[1]}</Nav.Link>
            </Nav>
            { user[2] === true ? //if user is admin
              <ButtonGroup className="mb-3">
                <Button onClick={()=>{navigateTo('../addNewChallenge')}} variant='success'><i className='bi-plus-circle'></i> Add challenge</Button>
                <Button onClick={()=>navigateTo('../adminPanel')} variant='success'>Admin Panel</Button>
              </ButtonGroup> :
              <Button onClick={()=>{navigateTo('../addNewChallenge')}} variant='success'><i className='bi-plus-circle'></i> Add challenge</Button>
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className='pt-4 pb-5'>
        <Form>
          <div className='mb-1'>
            <Form.Check inline onChange={()=>setExpiredVisible(!expiredVisible)} defaultChecked='true' type='checkbox' label='Hide expired' />
            <Form.Check inline onChange={()=>setFinishedVisible(!finishedVisible)} type='checkbox' label='Hide Finished' />
          </div>
        </Form>
        <Tabs
          defaultActiveKey='all'
          id='challenge-filter-tab'
          className='mb-3'
          justify
        >
          <Tab eventKey='all' title='All'>
            {(!challenges.length) ?
            <p className='text-center text-muted mt-5'>No challenges found</p>
            :
            all.map(challenge => 
              <Element 
                handleChangeState={props.handleChangeState} 
                key={challenge._id} 
                handleClaim={handleClaim} 
                challenge={challenge} 
                user={user}
              />
            )}
          </Tab>
          <Tab eventKey='available' title='Available'>
            {(!available.length) ?
            <p className='text-center text-muted mt-5'>No challenges found</p>
            :
            available.map(challenge => 
              <Element 
                handleChangeState={props.handleChangeState} 
                key={challenge._id}
                handleClaim={handleClaim} 
                challenge={challenge} 
                user={user}
              />
            )}
          </Tab>
          <Tab eventKey='yours' title='Created by you'>
            {(!yours.length) ?
            <p className='text-center text-muted mt-5'>No challenges found</p>
            :
            yours.map(challenge => 
              <Element 
                handleChangeState={props.handleChangeState} 
                key={challenge._id}
                handleClaim={handleClaim} 
                challenge={challenge} 
                user={user}
              />
            )}
          </Tab>
          <Tab eventKey='claimed' title='Claimed by you'>
            {(!claimed.length) ?
            <p className='text-center text-muted mt-5'>No challenges found</p>
            :
            claimed.map(challenge => 
              <Element 
                handleChangeState={props.handleChangeState} 
                key={challenge._id}
                handleClaim={handleClaim} 
                challenge={challenge} 
                user={user}
              />
            )}
          </Tab>
        </Tabs>
      </Container>

      <Navbar fixed='bottom' className='bg-success d-flex justify-content-center text-white'>
        Copyright &copy; 2023 | Laxmi Kumar Sahani
      </Navbar>
    </>
  )
}

function Main(){
  const [subPage, setSubPage] = useState(0);
  const [id, setId] = useState('');

  const handleChangeState = (id) =>{

    setSubPage(1);
    setId(id);
  }

  return (
    <>
    {subPage === 0 ? <ShowChallenges handleChangeState = {handleChangeState}/> : <Details setSubPage={setSubPage} id={id}/>}
    </>
  )
}
  
export default Main