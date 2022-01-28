import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import HomeView from './components/HomeView';
import ChatRoom from './components/ChatRoom';
const App = () =>  {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/chat-room">
            <ChatRoom/>
          </Route>
          <Route path="/">
            <HomeView/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
