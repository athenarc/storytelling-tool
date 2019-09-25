import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Card } from 'react-bootstrap'
import { postData, addToast } from '../../utils'
import { ENDPOINT } from '../../config'
import { TOAST } from '../../resources'
import Checkbox from '../lib/Checkbox'
import Iframe from 'react-iframe'
import Spinner from '../lib/Spinner'

export default function Assets(props) {

    const [query, setQuery] = useState("")
    const [searchOnSketchfab, setSearchOnSketchfab] = useState(true)
    const [searchOnEuropeana, setSearchOnEuropeana] = useState(true)
    const [assets, setAssets] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        postData(ENDPOINT.ASSETS.SEARCH, { query, searchOnSketchfab, searchOnEuropeana, }, true)
            .then(assets => {
                setAssets(assets)
                setIsLoading(false)
            })
            .catch(ex => addToast('Failed to load assets', TOAST.ERROR))
    }, [query, searchOnSketchfab, searchOnEuropeana])

    const handleChange = input => () => {
        input === 'fab'
            ? setSearchOnSketchfab(!searchOnSketchfab)
            : setSearchOnEuropeana(!searchOnEuropeana)
    }

    const getAssets = () => {
        return assets.map((model, index) => {
            return <Card key={index} style={styles.cardItem} onClick={() => {
                if (props.onAssetClick) props.onAssetClick(model)
            }}>
                <Card.Img variant="top" src={model.thumbnail} style={styles.cardImage} />
                {/* {model.embedUrl && <iframe id="modelEmbedded" src={model.embedUrl} className="w-100" style="height: 80px"></iframe>} */}
                {/* {model.embedUrl && <Iframe url={model.embedUrl} />} */}
                <Card.Body className="p-1 d-flex" style={{ alignItems: 'center' }}>
                    <Card.Text className="body-secondary p-1 my-0 f-12 mr-auto">{model.name}</Card.Text>
                    {model.embedUrl && <img alt="" width="18" height="18" className="m-1" src={require('../../assets/logo-sketchfab.png')} />}
                    {!model.embedUrl && <img alt="" width="15" height="18" className="m-1" src={require('../../assets/logo-europeana.png')} />}
                </Card.Body>
            </Card>
        })
    }

    return (
        <Container>
            <Row className="mt-5">
                <Col md={6} className="ml-auto">
                    <Row>
                        <Col className="max-content mt-2"><h4 className="header-primary">My Assets</h4></Col>
                        <Col><Form.Control value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="search" className="text-right bg-secondary" /></Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col className="max-content"><h6 className="d-inline header-primary mr-4 mt-1">FILTER</h6></Col>
                <Col className="max-content"><Checkbox label="Sketch FAB" checked={searchOnSketchfab} onChange={handleChange('fab')} /></Col>
                <Col className="max-content"><Checkbox label="Europeana" checked={searchOnEuropeana} onChange={handleChange('europeana')} /></Col>
            </Row>
            <div style={styles.cardContainer}>
                {isLoading && <Spinner size={50} classes={"my-4"} />}
                {getAssets()}
            </div>
        </Container>
    )
}

const styles = {
    cardContainer: {
        justifyContent: 'space-between',
        display: 'flex',
        flexWrap: 'wrap'
    },
    cardItem: {
        margin: 4,
        flex: 1,
        minWidth: 200,
        cursor: 'pointer'
    },
    cardImage: {
        height: 120
    }
}