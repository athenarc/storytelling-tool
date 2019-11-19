import React, { Fragment } from 'react'
import { Card } from 'react-bootstrap'
import { Redirect, Link } from 'react-router-dom'
import backgroundImage from '../../assets/background.jpg';

function Home(props) {

    const homeCards = () => (
        <div style={styles.wrapper}>
            <div style={styles.container} className="mt-5">
                <Card onClick={() => props.history.push('/explore')} style={{ zIndex: '10', backgroundColor: 'transparent', width: '20rem', height: '24rem', margin: '12px', border: '0' }}>
                    <Link to={`/explore`} className="btn btn-primary btn-lg" style={{ align: 'center', width: '100%', lineHeight: '80px' }} > Explore stories</Link>
                    <Card.Body className="body-secondary" style={{ backgroundColor: '#F1F1F1', border: '0', height: '20rem' }}>
                    Discover stories of artifacts, places, buildings and more cultural objects available in Sketchfab and Europeana, shaped by culture professionals, educators, artists, individuals and created with Share3D story maker tool.
                </Card.Body>
                </Card>

                <Card onClick={() => props.history.push('/workspace')} style={{ zIndex: '10', backgroundColor: 'transparent', width: '20rem', height: '24rem', margin: '12px', border: '0' }}>
                    <Link to={`/workspace`} className="btn btn-primary btn-lg" style={{ align: 'center', width: '100%', lineHeight: '80px' }} > Create a story</Link>
                    <Card.Body className="body-secondary" style={{ backgroundColor: '#F1F1F1', border: '0', height: '20rem' }}>
                    Combine 3D objects from you own cultural portfolio in Sketchfab with cultural assets from Europeana and build stories around them. Your stories can be then visible to others and may be a reference point for educators in classrooms, other professionals, tourism guides, and more!
                </Card.Body>
                </Card>

                <Card onClick={() => props.history.push('/learnmore')} style={{ zIndex: '10', backgroundColor: 'transparent', width: '20rem', height: '24rem', margin: '12px', border: '0' }}>
                    <Link to={`/learnmore`} className="btn btn-primary btn-lg" style={{ align: 'center', width: '100%', lineHeight: '80px' }} > Learn more</Link>
                    <Card.Body className="body-secondary" style={{ backgroundColor: '#F1F1F1', border: '0', height: '20rem' }}>
                    To learn more about how to join Share3D, you can read our FAQs and then create an account to start over. Don’t forget to read our tutorial! Also, if you want to share your content in Share3D,  it is advised to read our guidelines first.
                </Card.Body>
                </Card>
            </div >
            <div style={styles.containerBottom}></div>
        </div>
    )
    return (
        <Fragment>
            {
                !props.isLoading && props.isAuth
                    ? <Redirect to='/' />
                    : homeCards()
            }
        </Fragment>
    )
}

const styles = {
    wrapper: {
        width: 100 + '%',
        height: '100vh',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column'
    },
    container: {
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F1F1'
    },
    containerBottom: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F1F1',
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'bottom',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    link: {
        fontSize: 12,
        padding: 0
    }
}

export default Home
