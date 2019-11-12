import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { postData, addToast } from '../../utils'
import { BASE_URL } from '../../config'
import { TOAST } from '../../resources'

export default function ResetPassword({ show, handleClose }) {

    const [username, setUsername] = useState("")

    const handleChange = (e) => {
        setUsername(e.target.value)
    }

    const handleReset = (username) => {
        postData(BASE_URL + "/auth/reset_password", { username })
            .catch(() => {
                addToast("Something went wrong", TOAST.ERROR)
            })
    }

    return (
        <Modal
            show={show}
            centered
            onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Password reset form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    onKeyPress={handleChange}
                    className="form-control my-4"
                    placeholder="Please add your email"
                    id="username"
                    value={username}
                    onChange={handleChange} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button
                    disabled={!username}
                    variant="primary"
                    onClick={() => handleReset(username)}>
                    Reset Password
                    </Button>
            </Modal.Footer>
        </Modal>
    )
}
