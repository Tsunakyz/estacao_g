import { useEffect, useState } from "react"
import { Modal, Button, Row, Col, Form, Table, Collapse } from "react-bootstrap"
import { Plus, Trash } from 'react-feather'
import Axios from 'axios'
import { formataData } from "../../helpers/functions"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const FormCategorias = ({ show, handleClose }) => {
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState([])

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


    const getCategories = () => {
        Axios.get('http://localhost:3001/getCategories')
            .then(({data}) => {
                setCategories([...data])
            })
    }

    const addCategory = () => {
        if (category.length < 3) {
            showToast({
                message: 'Nome da categoria deve possuír mais de 3 caracteres.',
                variant: 'error'
            })
            return
        }

        if (categories.filter(e => e.name === category).length) {
            showToast({
                message: 'Categoria já cadastrada.',
                variant: 'error'
            })
            return
        }

        Axios.post('http://localhost:3001/addCategory', { name: category})
            .then(({data}) => {
                data.affectedRows 
                    ? showToast({
                        message: 'Categoria cadastrada com sucesso!',
                        variant: 'success'
                    })
                    : showToast({
                        message: 'Erro ao cadastrar Categoria.',
                        variant: 'error'
                    })
            })
            .catch(err => {
                console.log(err)
                showToast({
                    message: 'Erro ao cadastrar Categoria.',
                    variant: 'error'
                })
            })
            .then(() => getCategories())
    }

    const deleteCategory = id => {
        Axios.delete('http://localhost:3001/deleteCategory', { data: {id: id} })
            .then(({data}) => {
                setCategory('')
                data.affectedRows 
                    ? showToast({
                        message: 'Categoria excluída com sucesso!',
                        variant: 'success'
                    })
                    : showToast({
                        message: 'Erro ao excluir Categoria.',
                        variant: 'error'
                    })
            })
            .catch(err => {
                console.log(err)
                showToast({
                    message: 'Erro ao excluir Categoria.',
                    variant: 'error'
                })
            })
            .then(() => getCategories())
    }

    useEffect(() => {
        show && getCategories()
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
                <Modal.Title>Gerenciar Categorias</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg={12}>
                        <Form.Group className="mb-2 d-flex">
                            <Form.Control placeholder="Nome" value={category} onChange={e => setCategory(e.target.value)} />
                            <Button variant="primary" onClick={addCategory} className="ms-2">
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
                                    <th style={{width: 200}}>Cadastrada em</th>
                                    <th style={{width: 50}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(e => (
                                    <tr key={`category-${e.id}`}>
                                        <td className="text-center">{e.id}</td>
                                        <td>{e.name}</td>
                                        <td>{formataData(e.created_at, true)}</td>
                                        <td className="text-center">
                                        <Button variant="danger" size="sm" onClick={() => deleteCategory(e.id)}>
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

export default FormCategorias