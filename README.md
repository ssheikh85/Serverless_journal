# Journal Application

### Latest Build Status

[![Build Status](https://travis-ci.org/ssheikh85/CDND_Capstone.svg?branch=master)](https://travis-ci.org/ssheikh85/CDND_Capstone)

### Overview

An applicaiton that allows users to login in with their Google Account to create, read, update or delete private journal entries they have made.

The backend is built using the following technologies:

- Serverless Framework
- AWS CloudFormation, AWS APIGateway, AWS Lambda, AWS DynamodB, AWS S3
- Apollo Server Lambda
- Graphql
- NodeJS - Typescript

The Front is built using the following technologies

- Typescript
- Graphql
- Apollo Client
- Auth0
- React
- React Native

### How to Run

git clone 'https://github.com/ssheikh85/CDND_Capstone.git' (This repository)

#### Update April 2020: The backend stack has been removed from my AWS account, to deploy the backend, the serverless command line tools should be installed and an active AWS account will be needed with serverless set-up to use valid AWS credentials. Then once the repository is cloned (see above) 

cd backend
sls deploy

cd client
npm i

For browser based app:

- npm run web

For iOS based app
(Requires a mac and Xcode installed click here for instructions: [Install Xcode](https://docs.expo.io/versions/latest/workflow/ios-simulator/) - _Please follow steps 1 and 2 only to install Xcode and the simulator, this project was not developed using expo_) ...

- npm run ios

For Android based app
(Requires a connected Android device or an Android Virtual Device set-up using Android Studio click here for instructions to set-up a virtual device: [Install AVD](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/), then start the virtual device) ...

- npm run android

### Known Bugs

    - Browser/App refresh/relogin needed when an image is uploaded to display the image
    - Need to enter text into the add entry dialog to get an entry that has been updated to render
    - Cannot reupdate entries, pressing update again does not call the update component

### Future Features/Open Items

- Expanded test coverage
- Other login mechanisms
- User profile pages
- Ability to share posts you want to share
