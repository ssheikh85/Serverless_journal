import React, {useState, useEffect} from 'react';
import {Navbar, Nav, Card, Button} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import authHandlerWeb from './AuthHandlerWeb';
// import EntriesWeb from './EntriesWeb';

const RootWeb: React.FC<any> = () => {
  const isAuthenticated = authHandlerWeb.isAuthenticated();

  const [userName, setUserName] = useState('');
  // const [userId, setUserId] = useState('');

  useEffect(() => {
    const accessToken = authHandlerWeb.getAccesstoken();
    const getTheUser = async () => {
      const user = await authHandlerWeb.getUserInfo(accessToken);
      setUserName(user.given_name);
    };
    getTheUser();
  }, []);

  return (
    <div>
      {!isAuthenticated && (
        <>
          <Card className="text-center">
            <Card.Header>Welcome</Card.Header>
            <Card.Body>
              <Card.Title>Please Login In</Card.Title>
              <Button onClick={() => authHandlerWeb.login()}>Login</Button>
            </Card.Body>
          </Card>
        </>
      )}
      {isAuthenticated && (
        <>
          <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="#home"> Hello {userName} </Navbar.Brand>
            <Nav className="mr-auto"></Nav>
            <Button variant="danger" onClick={() => authHandlerWeb.logout()}>
              Logout
            </Button>
          </Navbar>
        </>
      )}
      {/* {isAuthenticated && user && EntriesWeb(userId)} */}
    </div>
  );
};

export default withRouter(RootWeb);

// const getToken = async () => {
//   const token = await getIdTokenClaims();
//   const idToken = token.__raw;
//   console.log(idToken);
// };
