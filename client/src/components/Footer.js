import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {

    //Open up creator's github profile
    const openGithub = () => {
        window.open('https://github.com/kevin-rph-lee')
      };

    return (
        <Navbar variant='dark' bg='dark' fixed='bottom' className='footer'>
        <Container fluid>
            <Nav></Nav>
            <Nav>
            <Navbar.Text onClick={openGithub} className='credits'>Created by: Kevin Lee <FontAwesomeIcon icon={faGithub} /></Navbar.Text>
            </Nav>
        </Container>
        </Navbar>
  
    );
  };
  
  export default Footer