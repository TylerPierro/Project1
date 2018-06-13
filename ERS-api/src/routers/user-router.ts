import express from 'express';
//import {Request, Response, NextFunction} from 'express';
import {User} from '../beans/User';
import * as userService from '../services/user-service';

export const userRouter = express.Router();

//userRouter.get('', (req: Request, resp: Response) => {
userRouter.get('', (req, resp) => {
    console.log('retrieving all users');
    userService.retrieveAllUsers()
        .then(data => {
            resp.json(data.Items);
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        })    
});

//userRouter.get('/username/:username', (req: Request, resp: Response) =>    {
userRouter.get('/username/:username', (req, resp) =>    {
    const username : string = req.params.username;
    console.log(`retrieving user with the name ${username}`);
    userService.findUserByUsername(username)
        .then(data => {
            console.log(data.Item);
            resp.json(data.Item);
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        })
});

function validUser(questionable : User) : boolean {
    let existing : string = 'failure';
    userService.findUserByUsername(questionable.getUsername())
        .then(data => {
            console.log('Username unavailable');
            //console.log(data.Item);
            return existing = data.Item.getUsername();
        })
        .catch(err => { console.log ('available'); });
    
    if (existing === questionable.getUsername()) { return false; }
    if (questionable.getUsername().indexOf(' ') > -1 || questionable.getPassword().indexOf(' ') > -1)  {
        return false;
    } //If the username or password contain a space, bad request
    else if (questionable.getFirstName().match(/^\d+/) || questionable.getLastName().match(/^\d+/))   {
        return false;
    } //If the first or last name contain a number, bad request
    else if (questionable.getEmail().indexOf('@') <= -1) {
        return false;
    } //If the email doesn't have an @ symbol, invalid email
    else if (!(questionable.getRole() === 'employee' || questionable.getRole() === 'admin'))  {
        return false;
    } //If the role isn't employee or email, bad request
    else { return true; } 
}

//userRouter.post('',(req: Request, resp: Response) =>   {
userRouter.post('',(req, resp) =>   {
    if (!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.role)   {
        resp.sendStatus(400);
    } //If a parameter is missing, bad request
    const u = new User(req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.email, req.body.role);
    if (validUser(u) === false) { resp.sendStatus(400); }
    else {
        console.log(`adding user: ${JSON.stringify(req.body)}
        to users`);
        userService.createUser(u)
            .then(data => {
                resp.json(data);
            })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        })
    }   
});

/**
 * This route expects an object with a username and password. If the username and password is recognized it will set a role attribute on 
 * the current session so that the role can be viewed upon future requests.
 */
userRouter.post('/login', (req, resp, next) => {
    const user = req.body && req.body;
    // should probably send a call to the db to get the actual user object to determine role
    const passwordHash = require('password-hash');
    userService.findUserByUsername(`${req.body.username}`)
        .then(data => {
            console.log(data.Item);
            if(req.body.username === data.Item.username && passwordHash.verify(req.body.password, data.Item.password))    {
                // req.session.role = data.Item.role;
                // req.session.username = data.Item.username;
                resp.json(data.Item);
                resp.sendStatus(200);
            } else { resp.sendStatus(401); }
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(401);
        })
  });

//userRouter.put('',(req: Request, resp: Response) =>   {
userRouter.put('',(req, resp) =>   {
    if (!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.role)   {
        resp.sendStatus(400);
    } //If a parameter is missing, bad request
    const u = new User(req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.email, req.body.role);
    console.log(`updating user: ${JSON.stringify(req.body)}
        in users`);
    if (!validUser) { resp.sendStatus(400); }
    else {
        userService.updateUser(u)
            .then(data => {
                resp.json(data);
            })
            .catch(err => {
                console.log(err);
                resp.sendStatus(500);
            })
    }
});

//userRouter.delete('/delete/:username', (req: Request, resp: Response) =>    {
userRouter.delete('/delete/:username', (req, resp) =>    {
    userService.removeuser(req.params.username)
        .then(data => {
            resp.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        })
})