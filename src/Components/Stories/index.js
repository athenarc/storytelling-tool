import React, { useState, useEffect } from 'react'
import { Table, Row, Col, Button, Container, Modal } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { fetchData, postData, deleteData, maxLetters } from '../../utils'
import { ENDPOINT } from '../../config'
import imagePlaceholder from '../../assets/image-placeholder.png';
library.add(faSave, faTrashAlt, faCaretRight)

const Stories = (props) => {

    const [deleteStoryId, setDeleteStoryId] = useState(0)
    const [shareStoryId, setShareStoryId] = useState(0)
    const [unShareStoryId, setUnShareStoryId] = useState(0)
    const [stories, setStories] = useState([])
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showModalShare, setShowModalShare] = useState(false)
    const [showModalUnShare, setShowModalUnShare] = useState(false)

    useEffect(() => {
        fetchData(ENDPOINT.STORIES)
            .then(data => setStories(data))
            .catch(ex => console.log(ex))
        // return () => {
        //     cleanup
        // };
        //handleCloseModalDelete = handleCloseModalDelete.bind(this)
    }, [])

    const handleCloseModalDelete = () => {
        setShowModalDelete(false)
    }

    const handleCloseModalShare = () => {
        setShowModalShare(false)
    }

    const handleCloseModalUnShare = () => {
        setShowModalUnShare(false)
    }

    const confirmDelete = (storyId) => {
        setDeleteStoryId(storyId)
        setShowModalDelete(true)
    }

    const confirmShare = (storyId) => {
        setShareStoryId(storyId)
        setShowModalShare(true)
    }

    const confirmUnShare = (storyId) => {
        setUnShareStoryId(storyId)
        setShowModalUnShare(true)
    }

    const deleteStory = () => {
        if (showModalDelete) {
            deleteData(ENDPOINT.STORIES + `/${deleteStoryId}`, null)
                .then(
                    setStories(stories.filter(function (story) {
                        return story.id !== deleteStoryId
                    }))
                )
                .catch(ex => console.log(ex))
            setShowModalDelete(false)
        }
    }

    const publishStory = () => {
        if (showModalShare) {
            postData(ENDPOINT.STORIES + `/${shareStoryId}/publish`, null)
                .then(
                    fetchData(ENDPOINT.STORIES)
                        .then(data => setStories(data))
                        .catch(ex => console.log(ex))
                )
                .catch(ex => console.log(ex))
            setShowModalShare(false)
        }
    }


    const unPublishStory = () => {
        if (showModalUnShare) {
            postData(ENDPOINT.STORIES + `/${unShareStoryId}/unpublish`, null)
                .then(
                    fetchData(ENDPOINT.STORIES)
                        .then(data => setStories(data))
                        .catch(ex => console.log(ex))
                )
                .catch(ex => console.log(ex))
            setShowModalUnShare(false)
        }
    }

    const getStoryItem = (story) => {

        let storyImage = imagePlaceholder;
        if (story.chapters && story.chapters.length > 0 && story.chapters[0].assets.length > 0)
            storyImage = story.chapters[0].assets[0].thumbnail

        return <Row className="mt-2" key={story.id}>
            <Col style={styles.maxContent}>
                <img src={storyImage} style={styles.itemImage} />
            </Col>
            <Col style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 className="header-primary">{story.title}</h4>
                <div className="body-secondary">{maxLetters(story.description, 250)}</div>
                <Row className="mt-auto">
                    <Col style={styles.maxContent}><Button variant={story.isPublic ? 'success' : 'primary'}>{story.isPublic ? 'Published' : 'Private'}</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary" onClick={() => props.history.push(`/story/${story.id}`)}>View</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary" onClick={() => props.history.push(`/editor/${story.id}`)}>Edit</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary" onClick={() => confirmDelete(story.id)}>Delete</Button></Col>
                    {!story.isPublic && <Col style={styles.maxContent}><Button variant="secondary" onClick={() => confirmShare(story.id)}>Share</Button></Col>}
                    {story.isPublic && <Col style={styles.maxContent}><Button variant="secondary" onClick={() => confirmUnShare(story.id)}>UnShare</Button></Col>}
                </Row>
            </Col>
        </Row>
    }

    return (
        <React.Fragment >
            <Container className="my-5">
                <Row>
                    <Col><Button className="w-100" size="lg">My Stories</Button></Col>
                </Row>
                {
                    stories.map(story => getStoryItem(story))
                }
            </Container>
            <Modal show={showModalDelete} onHide={handleCloseModalDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this story ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => deleteStory()}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModalDelete}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalShare} onHide={handleCloseModalShare}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Share</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to publish this story ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => publishStory()}>
                        Share
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModalShare}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showModalUnShare} onHide={handleCloseModalUnShare}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm UnPublish</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to un-publish this story ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => unPublishStory()}>
                        Un-Share
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModalUnShare}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </React.Fragment>
    )

}

export default Stories

const styles = {
    itemImage: {
        width: 197,
        height: 172
    },
    maxContent: {
        maxWidth: 'max-content'
    }
}