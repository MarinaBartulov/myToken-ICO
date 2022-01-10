import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import logo from '../assets/logo.jpg';

function CustomNavbar() {
  return (
      <Navbar bg="dark" variant="dark">
        <Container>
            <Navbar.Brand href="#home">
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
            MyToken ICO
            </Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export default CustomNavbar;