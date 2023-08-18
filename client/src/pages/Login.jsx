import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Login(){
    const [loginController, setLoginController] = useState('');
    const [passwordController, setPasswordController] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [validated, setValidated] = useState(false);

    const navigateTo = useNavigate();

    const handleLogin = async (event) => {
        // form validation
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
    
        setValidated(true);


        event.preventDefault();
        await axios.post('https://task-and-challenge-server.vercel.app/api/login', {
            login: loginController,
            password: passwordController,
        }).then(response => {
            if (response.status === 200) {
                localStorage.setItem('accessToken',response.data.token);
                navigateTo('../');
            }
            else if(response.status === 300){
                setResponseMessage('Wrong password');
            }
        }).catch(error => {
            if (error.response && error.response.status === 410) {
                setResponseMessage('No user found');
            } 
            else if (error.response && error.response.status === 300) {
                setResponseMessage('Wrong password');
            }
            else {
                console.log(error);
                setResponseMessage('Unexpected error');
            }
        });
    };

    return(
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <div className='text-center'>
                    <h1>Tasks and Challenges</h1>
                </div>
                <Col className='m-3 p-4 border border-5 border-light rounded'>
                    <Form noValidate validated={validated} onSubmit={(event) => handleLogin(event)}>

                        <Form.Group className='mb-3' controlId='formLogin'>
                            <Form.Label>Login</Form.Label>
                            <Form.Control 
                                value={loginController} 
                                onChange={event => setLoginController(event.target.value)} 
                                type='text' 
                                placeholder='Enter login' 
                                maxLength={50}
                                required 
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid login.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='formPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                value={passwordController} 
                                onChange={event => setPasswordController(event.target.value)} 
                                type='password' 
                                placeholder='Enter password' 
                                maxLength={50}
                                required 
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button className='w-100' variant='success' type='submit'>
                            Sign in
                        </Button>

                        <Form.Group className='text-center m-1'>
                            <Form.Text id='signUpLink'>
                                Don't have an account? <a href='http://localhost:5173/register'>Sign up</a>
                            </Form.Text>
                            <br></br>
                            <Form.Text className='text-danger' id='responseMessage'>
                                {responseMessage}
                            </Form.Text>
                        </Form.Group>
                        
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
export default Login
