import express from 'express';
import {Request, Response, NextFunction} from 'express';
import {User} from './User';

export const userRouter = express.Router();

const tsp : User = new User('TyPiRo', 'flubber', 'Tyler', 'Pierro', 'i.tyler.pierro@gmail.com', 'employee');
const hjp : User = new User('HoJo', 'flubber', 'Holly', 'Pierro', 'parttimeninjawoo@gmail.com', 'admin');
const bbo : User = new User('BillyBob', 'flubber', 'Billy', 'Bob', 'billybob@aol.com', 'employee');
export let users : User[] = new Array(); 
users = [
    tsp, hjp, bbo
]
/*let users = [
    {
        username: 'TyPiRo',
        password: 'flubber',
        firstName: 'Tyler',
        lastName: 'Pierro',
        email: 'i.tyler.pierro@gmail.com',
        role: 'employee'
    },
    {
        username: 'HoJo', 
        password: 'flubber', 
        firstName: 'Holly', 
        lastName: 'Pierro', 
        email: 'parttimeninjawoo@gmail.com', 
        role: 'admin'
    }
]*/

function findUser(username : string) : User {
    for (let i = 0; i < users.length; i++)  {
        let u : User = users[i];
        if (u.getUsername() === username)   return u;
    }
}

userRouter.get('', (req: Request, resp: Response) => {
    console.log('retrieving all users');
    resp.json(users);
});

userRouter.get('/username/:username', (req: Request, resp: Response) =>    {
    const username = req.params.username;
    console.log(`retrieving user with the name ${username}`);
    //for (let u of users)    {
    const foundUser : User = findUser(username);
    if (foundUser !== null) resp.json(foundUser);
    else resp.sendStatus(400); 
});

userRouter.post('',(req: Request, resp: Response) =>   {
    console.log(`adding user: ${JSON.stringify(req.body)}
    to users`);
    if (!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.role)   {
        resp.sendStatus(400);
    } //If a parameter is missing, bad request
    else if (String(req.body.username).indexOf(' ') > -1 || String(req.body.password).indexOf(' ') > -1)  {
        resp.sendStatus(400);
    } //If the username or password contain a space, bad request
    else if (String(req.body.firstName).match(/^\d+/) || String(req.body.lastName).match(/^\d+/))   {
        resp.sendStatus(400);
    } //If the first or last name contain a number, bad request
    else if (String(req.body.email).indexOf('@') <= -1) {
        resp.sendStatus(400);
    } //If the email doesn't have an @ symbol, invalid email
    else if (!(req.body.role === 'employee' || req.body.role === 'admin'))  {
        resp.sendStatus(400);
    } //If the role isn't employee or email, bad request
    else {
        const u = new User(req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.email, req.body.role);
        users.push(u); 
        resp.sendStatus(201);
    }   
});

userRouter.put('',(req: Request, resp: Response) =>   {
    /*const myUserRequest = new Request(`get/user/username/${req.body.username}`);
    let userResult = fetch(myUserRequest).then(function(response) {
        if (response.status === 400) resp.sendStatus(404);
    }); //If the user isn't in the database, then the user wasn't found*/
    console.log(req.body.username);
    const userResult : User = findUser(req.body.username);
    console.log(req.body.username);
    if (userResult === null) resp.sendStatus(404);
    if (userResult.getFirstName() !== req.body.firstName) userResult.setFirstName(req.body.firstName);
    if (userResult.getLastName() !== req.body.lastName) userResult.setLastName(req.body.lastName);
    if (userResult.getPassword() !== req.body.password) userResult.setPassword(req.body.password);
    if (userResult.getEmail() !== req.body.email) userResult.setEmail(req.body.email);
    if (userResult.getRole() !== req.body.role) userResult.setRole(req.body.role);
    //note you can't change the username
    for (let i = 0; i < users.length; i++)  {
        if (users[i] === userResult) users.splice(i,1,userResult);
    }
    resp.send(users);
});

userRouter.delete('/delete/:username', (req: Request, resp: Response) =>    {
    users = users.filter((u) => u.getUsername() !== req.params.username);
    resp.end();
})