import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function NotLogged() {
    const navigateTo = useNavigate();

    const logIn= () =>{
        navigateTo('../login');
    }
    const signUp= () =>{
        navigateTo('../register');
    }

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <div className='text-center my-3'>
                    <i className='bi-shield-lock icon-big'></i>
                    <h1>You can't get here, because you aren't logged in</h1>
                </div>
                
                <Col xs={12} md={6} className='d-flex justify-content-center justify-content-md-end'>
                    <Button onClick={logIn} className='w-25 border border-3 border-secondary-subtle' variant='light' type='submit'>
                        Log in
                    </Button>
                </Col>

                <Col xs={12} md={6} className='d-flex justify-content-center justify-content-md-start mt-2 mt-md-0'>
                    <Button onClick={signUp} className='w-25' variant='success' type='submit'>
                        Sign up
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default NotLogged;