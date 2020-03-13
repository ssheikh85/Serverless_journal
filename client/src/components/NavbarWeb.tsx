import React from 'react';
import {Button} from 'react-native';
import {useAuth0} from '../auth/authHandlerWeb';

const NavbarWeb = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    // getIdTokenClaims,
  } = useAuth0();

  // const getToken = async () => {
  //   const token = await getIdTokenClaims();
  //   const idToken = token.__raw;
  //   console.log(idToken);
  // };
  return (
    <>
      {!isAuthenticated && (
        <Button title="Login" onPress={() => loginWithRedirect({})} />
      )}

      {isAuthenticated && <Button title="Logout" onPress={() => logout()} />}
      {/* <Button title="GetToken" onPress={() => getToken()} /> */}
    </>
  );
};

export default NavbarWeb;
