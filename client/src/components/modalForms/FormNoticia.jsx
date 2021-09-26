import { useEffect, useState } from "react"
import { Modal, Button, Row, Col, Form } from "react-bootstrap"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
]

const FormNoticia = ({id = null, show, handleClose}) => {
    const [categories, setCategories] = useState([])
    const [authors, setAuthors] = useState([])
    const [formData, setFormData] = useState({})
    const [quillValue, setQuillValue] = useState('')

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

    useEffect(async () => {
        if (id) {
            Axios.get('http://localhost:3001/getNoticeById?id=' + id,)
                .then(({data}) => {
                    if (data[0] && data[0].id) {
                        setFormData({
                            title: data[0].title,
                            subtitle: data[0].subtitle || '',
                            author: data[0].id_author,
                            category: data[0].id_category
                        })

                        setQuillValue(data[0].content)
                    }
                })
            
        }

        if (show) {
            Axios.get('http://localhost:3001/getCategories')
                .then(({data}) => {
                    setCategories([...data])
                })

            Axios.get('http://localhost:3001/getAuthors')
                .then(({data}) => {
                    setAuthors([...data])
                })
        }
        
    }, [show])

    const handleChangeValues = ({ target }) => {
        setFormData(preValue => ({
            ...preValue,
            [target.name]: target.value
        }))
    }

    const save = () => {
        if (!formData.title) {
            showToast({ message: 'Título deve estar preenchido.', variant: 'warning'})
            return
        } else if (!quillValue) {
            showToast({ message: 'Conteúdo deve estar preenchido.', variant: 'warning'})
            return
        } else if (!formData.author) {
            showToast({ message: 'Um autor deve estar selecionado.', variant: 'warning'})
            return
        } else if (!formData.category) {
            showToast({ message: 'Uma categoria deve estar selecionada.', variant: 'warning'})
            return
        }

        if (id) {
            Axios.put('http://localhost:3001/updateNotice', { ...formData, content: quillValue, id: id  })
                .then(({data}) => {
                    setFormData({})
                    setQuillValue('')
                    data.affectedRows 
                        ? showToast({
                            message: 'Notícia editada com sucesso!',
                            variant: 'success'
                        })
                        : showToast({
                            message: 'Erro ao editar Notícia.',
                            variant: 'error'
                        })

                        handleClose()
                })
                .catch(err => {
                    console.log(err)
                    showToast({
                        message: 'Erro ao cadastrar Notícia.',
                        variant: 'error'
                    })
                })
        } else {
            Axios.post('http://localhost:3001/addNotice', { ...formData, content: quillValue })
                .then(({data}) => {
                    setFormData({})
                    setQuillValue('')
                    data.affectedRows 
                        ? showToast({
                            message: 'Notícia cadastrada com sucesso!',
                            variant: 'success'
                        })
                        : showToast({
                            message: 'Erro ao cadastrar Notícia.',
                            variant: 'error'
                        })
                })
                .catch(err => {
                    console.log(err)
                    showToast({
                        message: 'Erro ao cadastrar Notícia.',
                        variant: 'error'
                    })
                })
        }
    }

    
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
                <Modal.Title>{id ? 'Editar' : 'Cadastrar'} Notícia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg={12}>
                        <Form.Group className="mb-2">
                            <Form.Label>Título</Form.Label>
                            <Form.Control name="title" onChange={handleChangeValues} value={formData.title || ''} />
                        </Form.Group>
                    </Col>
                    <Col lg={12}>
                        <Form.Group className="mb-2">
                            <Form.Label>Subtítulo</Form.Label>
                            <Form.Control name="subtitle" onChange={handleChangeValues} value={formData.subtitle || ''} />
                        </Form.Group>
                    </Col>
                    <Col lg={12}>
                        <Form.Group className="mb-2">
                            <Form.Label>Conteúdo</Form.Label>
                            <ReactQuill 
                                theme="snow" 
                                value={quillValue} 
                                onChange={setQuillValue} 
                                modules={modules} 
                                formats={formats} 
                            />
                        </Form.Group>
                    </Col>
                    
                    <Col lg={6}>
                        <Form.Group className="mb-2">
                            <Form.Label>Autor</Form.Label>
                            <Form.Select name="author" value={formData.author || ''} onChange={handleChangeValues}>
                                <option>Selecione...</option>
                                {authors.map(e => (
                                    <option key={`notice-author-${e.id}`} value={e.id}>{e.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col lg={6}>
                        <Form.Group className="mb-2">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select name="category" value={formData.category || ''} onChange={handleChangeValues}>
                                <option>Selecione...</option>
                                {categories.map(e => (
                                    <option key={`notice-category-${e.id}`} value={e.id}>{e.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={save}>{id ? 'Salvar' : 'Publicar'}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FormNoticia