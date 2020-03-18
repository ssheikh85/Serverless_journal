import React, {useEffect} from 'react';
import {Card} from 'react-bootstrap';
import authHandlerWeb from './AuthHandlerWeb';
import {withRouter} from 'react-router-dom';

// Class developed from this tutorial
//https://auth0.com/blog/develop-modern-apps-with-react-graphql-apollo-and-add-authentication/

const Callback: React.FC = (props: any) => {
  useEffect(() => {
    const authenticate = async () => {
      await authHandlerWeb.handleAuthentication();
      props.history.replace('/');
    };
    authenticate();
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
