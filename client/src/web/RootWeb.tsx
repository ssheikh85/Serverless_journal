import React from 'react';
import {Navbar, Button} from 'react-bootstrap';
import {useAuth0} from './authHandlerWeb';
import {EntriesWeb} from './EntriesWeb';

const RootWeb = () => {
  const {isAuthenticated, loginWithRedirect, logout, user} = useAuth0();

  let name = '';
  let userProp = {};
  if (isAuthenticated && user) {
    name = user.given_name;
    userProp = user;
  }

  return (
    <>
      <div>
        {!isAuthenticated && (
          <>
            <h2>Please log in</h2>
            <button onClick={() => loginWithRedirect({})}>Login</button>
          </>
        )}
        {isAuthenticated && (
          <>
            <Navbar bg="light" variant="light">
              {' '}
              Welcome, {name}{' '}
              <Button variant="danger" onClick={() => logout()}>
                Logout
              </Button>
            </Navbar>
            <>
              <EntriesWeb userProp={userProp} />
            </>
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
