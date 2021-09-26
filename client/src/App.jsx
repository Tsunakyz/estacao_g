import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Form, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import Content from './components/Content';
import { ToastContainer } from 'react-toastify';
function App() {
    const [updateValues, setUpdateValues] = useState('')
    const updateAll = () => {
        setUpdateValues(new Date().getTime())
    }

    return (
        <div className="App">
            <Header updateAll={updateAll} />
            <br />
            <Content updateValues={updateValues} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
        </div>
    )
}

export default App
