import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Container, Modal } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { fetchData, deleteData, } from '../../utils'
import { ENDPOINT } from '../../config'
import UploadModal from './UploadModal'
import Spinner from '../lib/Spinner'
library.add(faSave, faTrashAlt, faCaretRight)

function StoryItem({ item, confirmDelete }) {
    return <Row className="mt-2" key={item.uid}>
        <Col style={styles.maxContent}>
            <img alt="" src={item.uri} style={styles.itemImage} />
        </Col>
        <Col style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 className="header-primary">{item.name}</h4>
            {/* <div className="body-secondary">{maxLetters(story.description, 250)}</div> */}
            <Row className="mt-auto">
                {/* <Col style={styles.maxContent}><Button variant={story.isPublic ? 'success' : 'primary'}>{story.isPublic ? 'Published' : 'Private'}</Button></Col> */}
                {/* <Col style={styles.maxContent}><Button variant="secondary" onClick={() => props.history.push(`/stories/${story.id}/view`)}>View</Button></Col> */}
                {/* <Col style={styles.maxContent}><Button variant="secondary" onClick={() => props.history.push(`/stories/${story.id}/edit`)}>Edit</Button></Col> */}
                <Col style={styles.maxContent}><Button variant="secondary" onClick={() => confirmDelete(item.uid)}>Delete</Button></Col>
                {/* {!story.isPublic && <Col style={styles.maxContent}><Button variant="secondary" onClick={() => confirmShare(story.id)}>Publish</Button></Col>} */}
                {/* {story.isPublic && <Col style={styles.maxContent}><Button variant="secondary" onClick={() => confirmUnShare(story.id)}>UnShare</Button></Col>} */}
            </Row>
        </Col>
    </Row>
}

const Uploads = (props) => {

    const [deleteUploadId, setDeleteUploadId] = useState(0)
    const [uploads, setUploads] = useState([])
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [openUpload, setOpenUpload] = useState(false)
    const [busy, setBusy] = useState(false)

    const getUploads = (callback) => {
        setBusy(true)
        fetchData(ENDPOINT.UPLOADS)
            .then(data => { setUploads(data); setBusy(false); callback && callback() })
            .catch(ex => { console.log(ex); setBusy(false) })
    }

    useEffect(() => {
        getUploads()
    }, [])

    const handleCloseModalDelete = () => {
        setShowModalDelete(false)
    }

    const confirmDelete = (uploadId) => {
        setDeleteUploadId(uploadId)
        setShowModalDelete(true)
    }

    const deleteUpload = () => {
        if (showModalDelete) {
            deleteData(ENDPOINT.UPLOADS + `/${deleteUploadId}`, null)
                .then(() => {
                    setUploads(uploads.filter(function (upload) {
                        return upload.uid !== deleteUploadId
                    }))
                })
                .catch(ex => console.log(ex))
            setShowModalDelete(false)
        }
    }

    // categories: null
    // description: null
    // embedUrl: null
    // id: null
    // language: ""
    // name: "test"
    // rights: ""
    // source: "uploads"
    // tags: null
    // thumbnail: ""
    // uid: "1"
    // uri: "https://app-share3d.imsi.athenarc.gr:8082/assets/upload/1/americano.png"


    return (
        <React.Fragment >
            <Container className="my-5">
                <Row>
                    <Col><Button className="w-100" size="lg">My Uploads</Button></Col>
                </Row>
                {busy && <Spinner />}
                {uploads.map(item => <StoryItem key={item.uid} item={item} confirmDelete={confirmDelete} />)}
                <Button variant="secondary" style={{ position: "fixed", bottom: 0, right: 0, margin: 20 }} onClick={() => setOpenUpload(true)}>
                    Upload Image
                </Button>
            </Container>


            <Modal show={showModalDelete} onHide={handleCloseModalDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this file ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => deleteUpload()}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModalDelete}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <UploadModal
                show={openUpload}
                handleClose={() => setOpenUpload(false)}
                getUploads={getUploads}
            />
        </React.Fragment>
    )

}

export default Uploads

const styles = {
    itemImage: {
        width: 197,
        height: 172
    },
    maxContent: {
        maxWidth: 'max-content'
    }
}