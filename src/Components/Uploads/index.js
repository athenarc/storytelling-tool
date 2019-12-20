import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Container, Modal } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { fetchData, postData, deleteData, maxLetters } from '../../utils'
import { ENDPOINT } from '../../config'
import imagePlaceholder from '../../assets/image-placeholder.png';
library.add(faSave, faTrashAlt, faCaretRight)

const Uploads = (props) => {

    const [deleteUploadId, setDeleteUploadId] = useState(0)
    const [uploads, setUploads] = useState([])
    const [showModalDelete, setShowModalDelete] = useState(false)

    useEffect(() => {
        fetchData(ENDPOINT.UPLOADS)
            .then(data => setUploads(data))
            .catch(ex => console.log(ex))
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
                        return upload.id !== deleteUploadId
                    }))
                })
                .catch(ex => console.log(ex))
            setShowModalDelete(false)
        }
    }

    const getUploadItem = (upload) => {
/*
        let storyImage = imagePlaceholder;
        if (story.chapters && story.chapters.length > 0 && story.chapters[0].assets.length > 0)
            storyImage = story.chapters[0].assets[0].thumbnail

        let categoryImage = <img alt="Slideshow" src={require('../../assets/story-2.png')} height={20} />
        if (story.category === 2) categoryImage = <img alt="Hotspots" src={require('../../assets/story-3.png')} height={20} />
        if (story.category === 3) categoryImage = <img alt="Timeline" src={require('../../assets/story-1.png')} height={20} />

        return <Row className="mt-2" key={story.id}>
            <Col style={styles.maxContent}>
                <img alt="" src={storyImage} style={styles.itemImage} />
            </Col>
            <Col style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 className="header-primary">{story.title} {story.category} {categoryImage}</h4>
                <div className="body-secondary">{maxLetters(story.description, 250)}</div>
                <Row className="mt-auto">
                    <Col style={styles.maxContent}><Button variant={story.isPublic ? 'success' : 'primary'}>{story.isPublic ? 'Published' : 'Private'}</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary" onClick={() => props.history.push(`/stories/${story.id}/view`)}>View</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary" onClick={() => props.history.push(`/stories/${story.id}/edit`)}>Edit</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary" onClick={() => confirmDelete(story.id)}>Delete</Button></Col>
                    {!story.isPublic && <Col style={styles.maxContent}><Button variant="secondary" onClick={() => confirmShare(story.id)}>Publish</Button></Col>}
                    {story.isPublic && <Col style={styles.maxContent}><Button variant="secondary" onClick={() => confirmUnShare(story.id)}>UnShare</Button></Col>}
                </Row>
            </Col>
        </Row>
        */
    }

    return (
        <React.Fragment >
            <Container className="my-5">
                <Row>
                    <Col><Button className="w-100" size="lg">My Uploads</Button></Col>
                </Row>
                {
                    uploads.map(upload => getUploadItem(upload))
                }
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