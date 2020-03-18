import React from 'react';
import {Navbar, Nav, Card, Button} from 'react-bootstrap';
import {useAuth0} from './authHandlerWeb';
// import {EntriesWeb} from './EntriesWeb';

const RootWeb = () => {
  const {isAuthenticated, loginWithRedirect, logout, user} = useAuth0();

  let name = '';
  if (isAuthenticated && user) {
    name = user.given_name;
  }

  return (
    <>
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
            <>{/* <EntriesWeb userProp={userProp} /> */}</>
          </>
        )}
      </div>
    </>
  );
};

export default RootWeb;

//Code to get a jwt token to test the server
// const getToken = async () => {
//   const token = await getIdTokenClaims();
//   const idToken = token.__raw;
//   console.log(idToken);
// };
// <Button onPress={() => getToken()} title="Token" />
