import React from 'react';
import {Navbar, Nav, Card, Button} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {useAuth0} from './AuthHandlerWeb';
import EntriesWeb from './EntriesWeb';

const RootWeb: React.FC<any> = () => {
  const {isAuthenticated, loginWithRedirect, logout, user} = useAuth0();
  let name = '';
  let userId = '';
  if (isAuthenticated && user) {
    name = user.given_name;
    userId = user.sub;
  }

  return (
    <div>
      {!isAuthenticated && (
        <>
          <Card className="text-center">
            <Card.Header>Welcome</Card.Header>
            <Card.Body>
              <Card.Title>Please Login In</Card.Title>
              <Button onClick={() => loginWithRedirect({})}>Login</Button>
            </Card.Body>
          </Card>
        </>
      )}
      {isAuthenticated && (
        <>
          <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="#home"> Hello {name} </Navbar.Brand>
            <Nav className="mr-auto"></Nav>
            <Button variant="danger" onClick={() => logout()}>
              Logout
            </Button>
          </Navbar>
        </>
      )}
      {isAuthenticated && user && EntriesWeb(userId)}
    </div>
  );
};

export default withRouter(RootWeb);

// const getToken = async () => {
//   const token = await getIdTokenClaims();
//   const idToken = token.__raw;
//   console.log(idToken);
// };
