import React from 'react';
import {Button} from 'react-native';
import {useAuth0} from '../auth/authHandlerWeb';

const NavbarWeb = () => {
  const {isAuthenticated, loginWithRedirect, logout} = useAuth0();

  return (
    <>
      {!isAuthenticated && (
        <Button title="Login" onPress={() => loginWithRedirect({})} />
      )}

      {isAuthenticated && <Button title="Logout" onPress={() => logout()} />}
    </>
  );
};

export default NavbarWeb;
