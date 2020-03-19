import React, {useEffect} from 'react';
import {Card} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import authHandlerWeb from './AuthHandlerWeb';

const Callback = (props: any) => {
  useEffect(() => {
    const handleAuthenticate = async () => {
      await authHandlerWeb.handleAuthentication();
      props.history.replace('/');
    };
    handleAuthenticate();
  }, [props.history]);

  return (
    <Card className="text-center">
      <Card.Header>Loading</Card.Header>
      <Card.Body>
        <Card.Title>Loading...</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default withRouter(Callback);
