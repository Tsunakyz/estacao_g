import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import GLogo from '../assets/images/g-logo.png'
import FormNoticia from './modalForms/FormNoticia';
import FormAutores from './modalForms/FormAutores';
import FormCategorias from './modalForms/FormCategorias';

const Header = ({ updateAll }) => {
    const [open, setOpen] = useState('')

    useEffect(() => {
        updateAll()
    }, [open])
    
    return (
        <div className="Header" style={{paddingBottom: 80}}>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand href="#home">
                        <img src={GLogo} width={40} /> Estação G
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <NavDropdown title="Gerenciar" id="collasible-nav-dropdown" drop="down">
                                <NavDropdown.Item onClick={() => setOpen('n')}>Notícias</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => setOpen('a')}>Autores</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => setOpen('c')}>Categorias</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <FormNoticia show={open === 'n'} handleClose={() => setOpen('')} />
            <FormAutores show={open === 'a'} handleClose={() => setOpen('')} />
            <FormCategorias show={open === 'c'} handleClose={() => setOpen('')} />
        </div>
    )
}

export default Header
