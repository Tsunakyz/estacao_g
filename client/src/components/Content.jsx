import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Form, Row, Col, Badge, Alert } from 'react-bootstrap';
import Axios from 'axios'
import { Markup } from 'interweave';
import { formataData } from '../helpers/functions';
import { Edit3, Trash } from 'react-feather';
import FormNoticia from './modalForms/FormNoticia';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Content = ({updateValues}) => {
    const [filter, setFilter] = useState({})
    const [notices, setNotices] = useState([])
    const [authors, setAuthors] = useState([])
    const [categories, setCategories] = useState([])
    const [idEdit, setIdEdit] = useState(null)

    const getNotices = () => {
        Axios.get('http://localhost:3001/getNotices')
            .then(({data}) => {
                data && setNotices(data)
            })
    }
    const getCategories = () => {
        Axios.get('http://localhost:3001/getCategories')
            .then(({data}) => {
                data && setCategories(data)
            })
    }
    const getAuthors = () => {
        Axios.get('http://localhost:3001/getAuthors')
            .then(({data}) => {
                data && setAuthors(data)
            })
    }

    useEffect(() => {
        getNotices()
        getCategories()
        getAuthors()
    }, [updateValues, idEdit])

    const FilteredNotices = notices.filter(e => {
        if (Object.keys(filter).length === 0) {
            return true
        } else {
            const validations = []

            filter.title && validations.push(e.title.includes(filter.title))
            filter.author && validations.push(e.id_author === parseInt(filter.author))
            filter.category && validations.push(e.id_category === parseInt(filter.category))
        
            return validations.every(e => e)
        }
    })

    const deleteNotice = id => {
        Axios.delete('http://localhost:3001/deleteNotice', { data: {id: id} })
            .then(({data}) => {
                if (data && data.affectedRows) {
                    getNotices()
                    toast('Notícia excluída com sucesso.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        type: 'success'
                    })
            }
            })
    }

    const handleChangeValues = ({ target }) => {
        setFilter(preValue => ({
            ...preValue,
            [target.name]: target.value
        }))
    }

    return (
        <div className="Content">
            <Container>
                <Card className="mb-3">
                    <Card.Body>
                        <Form>
                            <h4>Pesquisar</h4>
                            <Row>
                                <Col lg={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Título</Form.Label>
                                        <Form.Control type="text" placeholder="..." name="title" onChange={handleChangeValues} />
                                    </Form.Group>
                                </Col>
                                <Col lg={3}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Categoria</Form.Label>
                                        <Form.Select  name="category" onChange={handleChangeValues}>
                                            <option value="">Todas</option>
                                            {categories.map(e => (
                                                <option key={`list-category-${e.id}`} value={e.id} >{e.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col lg={3}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Autor</Form.Label>
                                        <Form.Select  name="author" onChange={handleChangeValues}>
                                            <option value="">Todos</option>
                                            {authors.map(e => (
                                                <option key={`list-author-${e.id}`} value={e.id} >{e.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
                <br />
                {FilteredNotices.map(e => 
                    <Card className="mb-3" key={`notice-${e.id}`}>
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Title>{e.title}</Card.Title>
                                <Card.Title><Badge bg="dark">{e.category_name}</Badge></Card.Title>
                            </div>
                            {e.subtitle ? (
                                <Card.Subtitle className="mb-2 text-muted"><i>{e.subtitle}</i></Card.Subtitle >
                            ) : false}
                            <Markup content={e.content} />
                            <hr />
                            <Card.Text className="fw-lighter">
                                <div className="d-flex justify-content-between">
                                    <span>De: {e.author_name}</span>
                                    <span>Publicado em: {formataData(e.created_at, true)}</span>
                                    <span>
                                        <Button variant="outline-primary" size="sm" onClick={() => setIdEdit(e.id)}><Edit3 size={18} /></Button>
                                        {' '}
                                        <Button variant="outline-danger" size="sm" onClick={() => deleteNotice(e.id)}><Trash size={18} /></Button>
                                    </span>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                )}
                {!FilteredNotices.length ? (
                    <Alert variant="info">
                        Nenhum registro encontrado.
                    </Alert>
                ) : false}
                {idEdit ? (
                    <FormNoticia show={!!idEdit} handleClose={() => setIdEdit(null)} id={idEdit} />
                ) : false}
                
            </Container>
        </div>
    )
}

export default Content
