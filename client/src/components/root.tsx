import React from 'react';
import authHandlerMobile from '../auth/authHandlerMobile';
import {useAuth0} from '../auth/authHandlerWeb';
import {Login} from '../components/Login';
import {Entries} from '../components/Entries';

const Root = () => {
  const {isAuthenticated} = useAuth0();
  const authToken = authHandlerMobile.getAccessToken();

  return <></>;
};

export default Root;

// {(isAuthenticated || authToken) &&

//   component={Entries}
