import React from 'react';
import {useAuth0} from './authHandlerWeb';
import {EntriesWeb} from './EntriesWeb';

const LoginWeb = () => {
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
            <h2>Please log in</h2>
            <button onClick={() => loginWithRedirect({})}>Login</button>
          </>
        )}
        {isAuthenticated && (
          <>
            <h1> Welcome, {name} </h1>>
            <button onClick={() => logout()}>Logout</button>
            <>
              <EntriesWeb />
            </>
          </>
        )}
      </div>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
});

export default LoginWeb;

//Code to get a jwt token to test the server
// const getToken = async () => {
//   const token = await getIdTokenClaims();
//   const idToken = token.__raw;
//   console.log(idToken);
// };
// <Button onPress={() => getToken()} title="Token" />
