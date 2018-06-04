import express from 'express';
//import {Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import { userRouter } from './routers/user-router';
import { reimbursementRouter } from './routers/reimbursement-router';
//import { sessionRouter } from './routers/session';
const app = express();

const port = 3000;
app.set('port', port);


const sess = {
    secret: 'keyboard cat',
    cookie: { secure: false },
    resave: false,
    saveUninitialized: false
  };

  // set up express to attach sessions
app.use(session(sess));

// allow static content to be served, navigating to url with nothing after / will serve index.html from public
app.use(
    express.static(path.join(__dirname, 'static'))
);

// Log all requests url and method to the console
app.use((req, resp, next) =>  {
    console.log(`request was made with url: ${req.path}
    and method: ${req.method}`);
    next();
});
//Register body parser to convert request join to an actual object
app.use(bodyParser.json());

// allow cross origins
app.use((req, resp, next) => {
    resp.header("Access-Control-Allow-Origin", "*");
    resp.header("Access-Control-Allow-Credentials: true")
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/***************************************************************
 * Register Routers
 **************************************************************/
app.use('/users', userRouter);
app.use('/reimbursements', reimbursementRouter);
//app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge : 60000 }}), sessionRouter);


app.listen(port, () =>  {
    console.log(`app is running at http://localhost:${app.get('port')}`);
}); 