import express from 'express';
import {Request, Response, NextFunction} from 'express';
//import session from 'express-session';
import { ESPIPE } from 'constants';
import { userRouter } from './routers/user-router';
import { reimbursementRouter } from './routers/reimbursement-router';
//import { sessionRouter } from './routers/session';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
app.set('port', port);

/**
 * Log all requests url and method to the console
 */
app.use((req:  Request, resp: Response, next: NextFunction) =>  {
    console.log(`request was made with url: ${req.path}
    and method: ${req.method}`);
    next();
});

/**
 * Register body parser to convert request join to an actual object
 */
app.use(bodyParser.json());
/***************************************************************
 * Register Routers
 **************************************************************/
app.use('/users', userRouter);
app.use('/reimbursements', reimbursementRouter);
//app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge : 60000 }}), sessionRouter);


app.listen(port, () =>  {
    console.log(`app is running at http://localhost:${app.get('port')}`);
}); 