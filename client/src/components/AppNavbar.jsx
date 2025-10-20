import { useState } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container
} from 'reactstrap';

const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar color="dark" dark expand="sm" className="mb-5">
        <Container className="d-flex justify-content-between align-items-center">
          <NavbarBrand href="/">Shopping List</NavbarBrand>

          <div className="d-flex align-items-center">
            <NavbarToggler onClick={toggleNavbar} />
          </div>
        </Container>

        <Collapse isOpen={isOpen} navbar>
          <Container>
            <Nav className="ms-auto" navbar>
              <NavItem>
                <NavLink href="https://github.com/isoumya16">GitHub</NavLink>
              </NavItem>
            </Nav>
          </Container>
        </Collapse>
      </Navbar>
    </div>
  )
}

export default AppNavbar