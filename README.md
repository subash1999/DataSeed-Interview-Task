# Log Dashboard React Django Full Stack Application

This project has the JWT authentication, redux state management, form validation, front-end and back-end unit test and CRUD opertaions for log source.
Note: This app is using sqlite for convinience but we can easily migrate to any realtional database as django model makes it easier for us

## Concept

Every user has multiple log sources and every source has multiple logs with different serverity levels.

## To get started

fe_log_app is the react app and the be_log_dashboard is the django app

### Initialize Djanog App

- create virtual env using the requirements.txt file
- activate virtual env
- python manage.py makemigrations
- python manage.py migrate
- pyhton manage.py createsuperuser
- you can use the super user or any other user to login into the system form the react app
- you can test appliaction using python manage.py test

### Intialize React App

- go to the react app folder
- make sure node is installed
- npm install
- run the react app using command npm start
- test using npm test

## Libraries Used Backend

- drf_api_logger, # package to log the api requests made to backend services automatically
- django_guid, # package to help track a single api request in the log made by programmer manually
- rest_framework, # rest framework
- rest_framework_simplejwt, # rest framework simple jwt
- corsheaders, # cors headers
- django_extensions,

## Libraries Used FrontEnd

- "axios": "^0.27.2",
- "axios-mock-adapter": "^1.21.2",
- "bootstrap": "^5.2.3",
- "cors": "^2.8.5",
- "dotenv": "^16.0.3",
- "formik": "^2.2.9",
- "history": "^5.3.0",
- "jwt-decode": "^3.1.2",
- "react": "^18.2.0",
- "react-bootstrap": "^2.7.2",
- "react-dom": "^18.2.0",
- "react-icons": "^4.8.0",
- "react-notifications": "^1.7.4",
- "react-redux": "^8.0.5",
- "react-router-dom": "^6.8.2",
- "react-scripts": "5.0.1",
- "web-vitals": "^2.1.4",
- "yup": "^1.0.2"
