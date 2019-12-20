import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { postData, addToast } from '../../utils'
import { ENDPOINT } from '../../config'
import { TOAST } from '../../resources'
import Checkbox from '../lib/Checkbox'
import Spinner from '../lib/Spinner'
import SearchText from '../lib/SearchText'


export default function Assets(props) {

    const [query, setQuery] = useState("")
    const [searchOnSketchfab, setSearchOnSketchfab] = useState(true)
    const [searchOnEuropeana, setSearchOnEuropeana] = useState(true)
    const [searchOnUploads, setSearchOnUploads] = useState(true)
    const [assets, setAssets] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    const performSearch = React.useCallback((searchOnSketchfab, searchOnEuropeana, searchOnUploads) => {
        setIsLoading(true)
        postData(ENDPOINT.ASSETS.SEARCH, { query, searchOnSketchfab, searchOnEuropeana, searchOnUploads }, true)
            .then(assets => {
                setAssets(assets)
                setIsLoading(false)
            })
            .catch(ex => addToast('Failed to load assets', TOAST.ERROR))
    }, [query])

    useEffect(() => {
        performSearch(searchOnSketchfab, searchOnEuropeana, searchOnUploads)
    }, [searchOnSketchfab, searchOnEuropeana, searchOnUploads, performSearch])


    const handleChange = input => () => {
        switch(input) {
            case 'fab': 
                setSearchOnSketchfab(!searchOnSketchfab)
                return
            case 'europeana': 
                setSearchOnEuropeana(!searchOnEuropeana)
                return
            case 'uploads': 
                setSearchOnUploads(!searchOnUploads)
                return
        }
    }

    const getAssets = () => {
        if(!isLoading && query && assets && assets.length===0) {
            return <div style={styles.notFound}><br/><br/><br/>No results found, please try a new inquiry</div>
        }
        if(!query && assets && assets.length===0) {
            return <div style={styles.notFound}><br/><br/><br/>Search to reveal 3D models</div>
        }
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
                        <Col className="max-content mt-2"><h4 className="header-primary">Search Assets</h4></Col>
                        <Col>
                            <SearchText onChange={(assyncQuery) => setQuery(assyncQuery)} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col className="max-content"><h6 className="d-inline header-primary mr-4 mt-1">FILTER</h6></Col>
                <Col className="max-content"><Checkbox label="Sketchfab" checked={searchOnSketchfab} onChange={handleChange('fab')} /></Col>
                <Col className="max-content"><Checkbox label="Europeana" checked={searchOnEuropeana} onChange={handleChange('europeana')} /></Col>
                <Col className="max-content"><Checkbox label="Uploads" checked={searchOnUploads} onChange={handleChange('uploads')} /></Col>
                <Col md={5} className="max-content"><sub className="d-inline header-primary mr-4 mt-1">* all assets are open licensed</sub></Col>
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
        cursor: 'pointer',
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        paddingTop: 8,
    },
    cardImage: {
        height: 120,
        maxWidth: 200
    },
    notFound: {
        margin: 4,
        width: '100%',
        textAlign: "center",
        paddingTop: 8
    },
}