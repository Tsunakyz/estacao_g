import { useEffect, useState } from "react"
import { Modal, Button, Row, Col, Form, Table, Collapse } from "react-bootstrap"
import { Plus, Trash } from 'react-feather'
import Axios from 'axios'
import { formataData } from "../../helpers/functions"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const FormAutores = ({ show, handleClose }) => {
    const [authors, setAuthors] = useState([])
    const [author, setAuthor] = useState([])

    const showToast = ({message, variant}) => {
        toast(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
            type: variant
        })
    }

    const getAuthors = () => {
        Axios.get('http://localhost:3001/getAuthors')
            .then(({data}) => {
                setAuthors([...data])
            })
    }

    const addAuthor = () => {
        if (author.length < 3) {
            showToast({
                message: 'Nome do autor deve possuír mais de 3 caracteres.',
                variant: 'error'
            })
            return
        }

        if (authors.filter(e => e.name === author).length) {
            showToast({
                message: 'Autor já cadastrado.',
                variant: 'error'
            })
            return
        }

        Axios.post('http://localhost:3001/addAuthor', { name: author})
            .then(({data}) => {
                setAuthor('')
                data.affectedRows 
                    ? showToast({
                        message: 'Autor cadastrado com sucesso!',
                        variant: 'success'
                    })
                    : showToast({
                        message: 'Erro ao cadastrar Autor.',
                        variant: 'error'
                    })
            })
            .catch(err => {
                console.log(err)
                showToast({
                    message: 'Erro ao cadastrar Autor.',
                    variant: 'error'
                })
            })
            .then(() => getAuthors())
    }

    const deleteAuthor = id => {
        Axios.delete('http://localhost:3001/deleteAuthor', { data: {id: id} })
            .then(({data}) => {
                data.affectedRows 
                    ? showToast({
                        message: 'Autor excluído com sucesso!',
                        variant: 'success'
                    })
                    : showToast({
                        message: 'Erro ao excluir Autor.',
                        variant: 'error'
                    })
            })
            .catch(err => {
                console.log(err)
                showToast({
                    message: 'Erro ao excluir Autor.',
                    variant: 'error'
                })
            })
            .then(() => getAuthors())
    }

    useEffect(() => {
        show && getAuthors()
    }, [show])

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            size="lg"
            keyboard={true}
            centered={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>Gerenciar Autores</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg={12}>
                        <Form.Group className="mb-2 d-flex">
                            <Form.Control placeholder="Nome" value={author} onChange={e => setAuthor(e.target.value)} />
                            <Button variant="primary" onClick={addAuthor} className="ms-2">
                                <Plus />
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col lg={12}>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>Nome</th>
                                    <th style={{width: 200}}>Cadastrado em</th>
                                    <th style={{width: 50}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {authors.map(e => (
                                    <tr key={`author-${e.id}`}>
                                        <td className="text-center">{e.id}</td>
                                        <td>{e.name}</td>
                                        <td>{formataData(e.created_at, true)}</td>
                                        <td className="text-center">
                                        <Button variant="danger" size="sm" onClick={() => deleteAuthor(e.id)}>
                                            <Trash size={16} />
                                        </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default FormAutores