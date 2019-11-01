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
import Explore from './Explore';
import LearnMore from './LearnMore';
import StoryView from './Stories/StoryView';
import StoryForm from './Stories/StoryForm';
import Login from './Login/Login'
import Register from './Login/Register'
import StoryEditor from './Stories/StoryEditor';

export default function Origin(props) {
    return (
        <div>
            <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
                <Header />
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/home" />} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/workspace" component={Workspace} />
                    <Route path="/workspace/:type" component={StoryForm} />
                    <Route path="/assets" component={Assets} />
                    <Route path="/explore" component={Explore} />
                    <Route path="/learnmore" component={LearnMore} />
                    <Route exact path="/stories" component={Stories} />
                    <Route path="/stories/:id/view" component={StoryView} />
                    <Route path="/stories/:id/edit" component={StoryEditor} />
                    <Route {...props} path="/login" component={(props) => <Login {...props} isAuth={props.isAuth} />} />
                    <Route {...props} path="/register" component={(props) => <Register {...props} isAuth={props.isAuth} />} />} />
                </Switch>
            </BrowserRouter>

        </div>
    )
}