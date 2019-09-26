import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './Components/NotFound'
import Home from './Components/Home'
import LearnMore from './Components/LearnMore'
import Explore from './Components/Explore'
import Stories from './Components/Stories'
import Login from './Components/Login/Login'
import Register from './Components/Login/Register'
import { fetchData, addToast, postData, requestAccess, getUser } from './utils';
import { ENDPOINT } from './config'
import * as Resourses from './resources'
import PrivateRoute from './Components/lib/PrivateRoute';
import Header from './Components/Header';
import Workspace from './Components/Workspace'
import StoryForm from './Components/Stories/StoryForm';
import Assets from './Components/Assets'
import StoryView from './Components/Stories/StoryView';
import SlideForm from './Components/Stories/SlideForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './App.css';
import Introduction from './Components/Home/Introduction';
import StoryCarousel from './Components/Stories/StoryCarousel';

const md5 = require('md5');

const storySchema = {
  id: null,
  title: "",
  description: "",
  category: null,
  chapters: []
}

const chapterSchema = {
  id: null,
  title: "",
  description: "",
  assets: []
}

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      story: storySchema,
      chapter: chapterSchema,
      user: null,
      stories: [],
      isAuth: false,
      isLoading: true,
      showAssetsInsideStoryForm: false
    }

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.register = this.register.bind(this)
    this.handleStoryUpdate = this.handleStoryUpdate.bind(this)
    this.handleChapterUpdate = this.handleChapterUpdate.bind(this)
    this.toggleAssetsInsideStoryForm = this.toggleAssetsInsideStoryForm.bind(this)
    this.handleStorySet = this.handleStorySet.bind(this)
  }

  toggleAssetsInsideStoryForm() {
    this.setState({ showAssetsInsideStoryForm: !this.state.showAssetsInsideStoryForm })
  }

  handleStoryUpdate(storyUpdates) {
    this.setState({
      story: {
        ...this.state.story,
        ...storyUpdates
      }
    })
  }

  handleStorySet(story) {
    this.setState({ story })
  }


  handleChapterUpdate(chapterUpdates) {
    this.setState({
      chapter: {
        ...this.state.chapter,
        ...chapterUpdates
      }
    })
  }

  componentDidMount() {
    postData(ENDPOINT.AUTH.STATUS, [], false, false)
      .then(() => {
        this.setState({
          isAuth: true,
          isLoading: false,
          user: getUser()
        })
      })
      .catch(() => {
        this.setState({
          isAuth: false,
          isLoading: false,
        })
      })
  }

  logout = () => {
    postData(ENDPOINT.AUTH.LOGOUT, [], false, false)
      .then(() => this.setState({ isAuth: false }))
      .catch(() => addToast('Failed to logout', Resourses.TOAST.ERROR))
  }

  login = (email, password) => {
    const hash = md5(password)
    const credentials = `${email}:${hash}`
    requestAccess(ENDPOINT.AUTH.LOGIN, [], credentials)
      .then(credentials => {
        localStorage.setItem('share3d_storytelling_credentials', JSON.stringify(credentials));
        this.setState({ isAuth: true, isLoading: false })
      }).catch(() => {
        this.setState({ isAuth: false, isLoading: false })
        // addToast('Invalid credentials', Resourses.TOAST.ERROR)
      })
  }

  register = (form) => {
    const hash = md5(form.password)
    form.password = hash
    postData(ENDPOINT.AUTH.SIGNUP, form, true)
      .then(() => {
        addToast('Account created', Resourses.TOAST.SUCCESS)
      })
      .catch(() => {
        addToast('Failed to create account', Resourses.TOAST.ERROR)
      })
  }

  render() {

    const { isLoading, isAuth, user, story, chapter, showAssetsInsideStoryForm } = this.state

    return (<React.Fragment>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
        <Header user={user} logout={this.logout} />
        <Switch>
          <Route exact path="/" component={() => <Redirect to="/home" />} />
          <Route path="/login" {...this.props} component={(props) => <Login  {...props} login={this.login} isAuth={isAuth} isLoading={isLoading} />} />
          <Route path="/register" {...this.props} component={(props) => <Register  {...props} register={this.register} isAuth={isAuth} isLoading={isLoading} />} />
          <PrivateRoute path="/home" {...this.props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <Home  {...props} permissions={[isAuth]} isLoading={isLoading} />} />
          <PrivateRoute path="/explore" {...this.props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <Explore  {...props} permissions={[isAuth]} isLoading={isLoading} />} />
          <PrivateRoute path="/learnmore" {...this.props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <LearnMore  {...props} permissions={[isAuth]} isLoading={isLoading} />} />
          <PrivateRoute exact path="/workspace" {...this.props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <Workspace  {...props} />} />
          <PrivateRoute path="/workspace/:type" {...this.props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <StoryForm toggleAssetsInsideStoryForm={this.toggleAssetsInsideStoryForm} showAssetsInsideStoryForm={showAssetsInsideStoryForm} story={story} updateStory={this.handleStoryUpdate} {...props} />} />
          <PrivateRoute path="/assets/" {...this.props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <Assets  {...props} />} />
          <PrivateRoute exact path="/editor" permissions={[isAuth]} isLoading={isLoading} {...this.props} component={(props) => <Stories {...props} />} />
          <PrivateRoute path="/editor/:id" {...this.props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <StoryView story={story} setStory={this.handleStorySet} updateStory={this.handleStoryUpdate} {...props} />} />
          <PrivateRoute path="/story/:id" {...this.props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <StoryCarousel {...props} />} />
          <PrivateRoute path="/slide/:storyId/:chapterId" {...this.props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <SlideForm chapter={chapter} updateChapter={this.handleChapterUpdate} toggleAssetsInsideStoryForm={this.toggleAssetsInsideStoryForm} showAssetsInsideStoryForm={showAssetsInsideStoryForm}   {...props} />} />
          <Route component={() => <NotFound />} />
        </Switch>
      </BrowserRouter>

    </React.Fragment>
    )
  }

}

