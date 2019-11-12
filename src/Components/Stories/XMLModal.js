import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { BASE_URL } from '../../config'
import { fetchData } from '../../utils'
import XMLViewer from 'react-xml-viewer'

export default function XMLModal(props) {

    const { close, story, open } = props
    const [xml, setXml] = useState("")

    useEffect(() => {
        if (story) {
            fetchData(`${BASE_URL}/stories/${story.id}/preview`, false)
                .then(res => res.text())
                .then(xml => setXml(xml))
                .catch(ex => console.log("failed to load xml", ex))
        }
    }, [story])

    return (
        <Modal size="xl" show={open} onHide={close}>
            <Modal.Header closeButton>
                <Modal.Title>{story && story.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <XMLViewer
                    xml={xml}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
