import React from 'react'
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Header from './/Header'
import Home from './Home'
import Workspace from './Workspace';
import Assets from './Assets';
import Stories from './Stories';
import Uploads from './Uploads';
import Explore from './Explore';
import LearnMore from './LearnMore';
import StoryView from './Stories/StoryView';
import StoryForm from './Stories/StoryForm';
import Login from './Login/Login'
import Register from './Login/Register'
import StoryEditor from './Stories/StoryEditor';
import PrivateRoute from './lib/PrivateRoute';

export default function Origin(props) {
    const { isLoading, isAuth, register, login } = props

    return (
        <div>
            <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
                <Header isAuth={isAuth} />
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/home" />} />
                    <Route {...props} exact path="/home" render={(props) => <Home isAuth={isAuth} history={props.history} />} />
                    <PrivateRoute permissions={[isAuth]} isLoading={isLoading} exact path="/workspace" component={Workspace} />
                    <PrivateRoute permissions={[isAuth]} isLoading={isLoading} path="/workspace/:type" component={StoryForm} />
                    <PrivateRoute permissions={[isAuth]} isLoading={isLoading} path="/assets" component={Assets} />
                    <Route path="/explore" component={Explore} />
                    <PrivateRoute permissions={[isAuth]} isLoading={isLoading} path="/learnmore" component={LearnMore} />
                    <PrivateRoute permissions={[isAuth]} isLoading={isLoading} exact path="/stories" component={Stories} />
                    <PrivateRoute permissions={[isAuth]} isLoading={isLoading} exact path="/uploads" component={Uploads} />
                    <Route permissions={[isAuth]} isLoading={isLoading} path="/stories/:id/view" component={StoryView} />
                    <PrivateRoute permissions={[isAuth]} isLoading={isLoading} path="/stories/:id/edit" component={StoryEditor} />
                    <Route {...props} path="/login" component={(props) => <Login {...props} login={login} isAuth={isAuth} />} />
                    <Route {...props} path="/register" component={(props) => <Register {...props} register={register} isAuth={isAuth} />} />} />
                </Switch>
            </BrowserRouter>

        </div>
    )
}