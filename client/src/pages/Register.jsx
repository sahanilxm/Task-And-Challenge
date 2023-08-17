import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';

function Register(){
    const [loginController, setLoginController] = useState('');
    const [passwordController, setPasswordController] = useState('');
    const [secondPasswordController, setSecondPasswordController] = useState('');
    const [passwordPower, setPasswordPower] = useState(0);
    const [responseMessage, setResponseMessage] = useState('');
    const [validated, setValidated] = useState(false);

    const navigateTo = useNavigate();

    const handleRegister = async (event) => {
        // form validation
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }

        setValidated(true);


        event.preventDefault();
        await axios.post('http://localhost:5000/api/handleRegistration', {
            login: loginController,
            password: passwordController,
        }).then((response) => {
            if (response.status === 201) {
                axios.post('http://localhost:5000/api/login', {
            login: loginController,
            password: passwordController,
        }).then(response => {
            if (response.status === 200) {
                localStorage.setItem('accessToken',response.data.token);
                navigateTo('../');
            }
        })
            }
        }).catch(error => {
            if (error.response && error.response.status === 409) {
                setResponseMessage('User with the same login already exists');
            } else {
                console.log(error);
                setResponseMessage('Unexpected error');
            }
        });
    };
    const passChanger = (event) =>{
        const password = event.target.value;
        setPasswordController(password);
        setPasswordPower((prevState) => {
            let power = 0;
            if (password.length >= 6) {
              power = 1;
              if (password.length >= 9) {
                power++;
              }
              if (/\d/.test(password)) { //if contains any numbers
                power++;
              }
              if (/[A-Z]/.test(password)) { //if contains uppercase letters
                power++;
              }
              if(password.includes('@') || password.includes('#') || password.includes('_') || password.includes('$')){
                power++;
              }
              if(password.includes('.') || password.includes('!') || password.includes('?') || password.includes(',')){
                power++;
              }
            }
            return power;
          });
    }

    return(
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <div className='text-center'>
                    <h1>Register</h1>
                </div>
                <Col className='m-3 p-4 border border-5 border-light rounded'>
                    <Form noValidate validated={validated} onSubmit={(event) => handleRegister(event)}>

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
                                onChange={event => passChanger(event)} 
                                type='password' 
                                placeholder='Enter password' 
                                maxLength={50}
                                required 
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                            <Form.Text>Strength:</Form.Text>
                            <ProgressBar now={passwordPower} max={6}/>
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='repeatPassword'>
                            <Form.Label>Repeat password</Form.Label>
                            <Form.Control 
                                value={secondPasswordController} 
                                onChange={event => setSecondPasswordController(event.target.value)} 
                                type='password' 
                                placeholder='Reenter password' 
                                maxLength={50}
                                required 
                            />
                            <Form.Text className='text-danger'>
                                {passwordController.length > 0 && passwordController != secondPasswordController && 'Passwords have to be the same.' }
                            </Form.Text>
                        </Form.Group>

                        <Button className='w-100' variant='success' type='submit'>
                            Sign up
                        </Button>

                        <Form.Group className='text-center m-1'>
                            <Form.Text id='logInLink'>
                                Have an account? <a href="http://localhost:5173/login">Log in</a>
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
export default Register