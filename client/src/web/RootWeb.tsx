import React from 'react';
import {Navbar, Nav, Card, Button} from 'react-bootstrap';
import authHandlerWeb from './AuthHandlerWeb';
import {withRouter} from 'react-router-dom';

const RootWeb: React.FC = (props: any) => {
  const isAuthenticated = authHandlerWeb.isAuthenticated();
  const user = authHandlerWeb.getUserInfo();

  let name = '';
  if (isAuthenticated && user) {
    name = user.given_name;
  }

  const handleLogout = () => {
    authHandlerWeb.logout();
    props.history.replace('/');
  };

  return (
    <>
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
              <Navbar.Brand href="#home"> Hello {name} </Navbar.Brand>
              <Nav className="mr-auto"></Nav>
              <Button variant="danger" onClick={() => handleLogout()}>
                Logout
              </Button>
            </Navbar>
            {/* <>{isAuthenticated && user && <EntriesWeb user={user} />}</> */}
          </>
        )}
      </div>
    </>
  );
};

export default withRouter(RootWeb);
