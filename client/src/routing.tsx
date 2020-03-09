import Auth from './Auth/Auth';
import {Router, Route} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import App from './components/App';
const history = createHistory();

const authHandler = new Auth(history);

const handleAuthentication = (props: any) => {
  const location = props.location;
  if (/access_token|id_token|error/.test(location.hash)) {
    authHandler.handleAuthentication();
  }
};

export const makeAuthRouting = () => {
  return (
    <Router history={history}>
      <div>
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props);
            return {};
          }}
        />
        <Route
          render={props => {
            return <App auth={authHandler} {...props} />;
          }}
        />
      </div>
    </Router>
  );
};
