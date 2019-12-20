import React, { useCallback, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import { getDefaultHeaders, addToast } from '../../utils'
import { ENDPOINT } from '../../config'
import axios from 'axios'
import { TOAST } from '../../resources'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const config = {
    headers: getDefaultHeaders()
}
function MyDropzone({ setAcceptedFiles, acceptedFiles }) {
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        setAcceptedFiles(acceptedFiles)
    }, [setAcceptedFiles])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    console.log(acceptedFiles[0])
    return (
        <>
            {
                acceptedFiles[0]
                    ? <div>{acceptedFiles[0].name} <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faTrash} onClick={() => setAcceptedFiles([])} /> </div>
                    : <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the files here ...</p> :
                                <>
                                    <img width={100} style={{ margin: 10 }} alt="" src={require('../../assets/image-placeholder.png')} />
                                    <p className="body-secondary">Drag 'n' drop your image here, or click to select.</p>
                                </>
                        }
                    </div>
            }
        </>

    )
}

export default function UploadModal({ show, handleClose, getUploads }) {
    const [name, setName] = useState("")
    const [acceptedFiles, setAcceptedFiles] = useState([])
    const [busy, setBusy] = useState(false)

    const uploadImage = () => {
        const data = new FormData()
        data.append('file', acceptedFiles[0])
        setBusy(true)
        axios.post(ENDPOINT.ASSETS.UPLOAD + `?name=${name}`, data, config)
            .then(() => {
                getUploads(handleClose)
                setBusy(false)
            }).catch(ex => {
                addToast("Failed to upoad", TOAST.ERROR)
                setBusy(false)
            })
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group controlId="name">
                    <Form.Label>Image Name</Form.Label>
                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter a name" />
                </Form.Group>

                <MyDropzone acceptedFiles={acceptedFiles} setAcceptedFiles={setAcceptedFiles} />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" disabled={!name || !acceptedFiles[0] || busy} onClick={uploadImage}>{busy ? "Uploading.." : "Upload Image"}</Button>
            </Modal.Footer>
        </Modal>
    )
}
