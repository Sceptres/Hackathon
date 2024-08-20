# Setup
To setup this project:
1. Setup a firebase project 
2. Copy the Firebase JSON configuration into two files
    1. `backend/key.json`
    2. `frontend/firebaseConfig.json`
3. While in the `frontend` folder run `npm install`
4. While in the `backend` folder run `pip install -r req.txt`
5. In the `frontend` folder add a file named `.env` and copy `REACT_APP_API_URL=url` where `url` is the web address of the backend

After following these steps you should be able to run both the frontend and backend.
1. To run the fronted on a local server, change your directory to the `frontend` folder and run `npm start`
2. To run the backend on a local server, change your directory to the root of the project and run
    1. `python .\backend\app.py` for windows
    2. `python ./backend/app.py` for Linux and Mac


# Steps to run backend in development mode
```
mac - export FLASK_DEBUG=develop    
windows - set FLASK_DEBUG=develop
```
