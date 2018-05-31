import express from 'express';
import {Request, Response, NextFunction} from 'express';
import {User} from '../beans/User';
import * as userService from '../services/user-service';

export const userRouter = express.Router();


/*const tsp : User = new User('TyPiRo', 'flubber', 'Tyler', 'Pierro', 'i.tyler.pierro@gmail.com', 'employee');
const hjp : User = new User('HoJo', 'flubber', 'Holly', 'Pierro', 'parttimeninjawoo@gmail.com', 'admin');
const bbo : User = new User('BillyBob', 'flubber', 'Billy', 'Bob', 'billybob@aol.com', 'employee');
export let users : User[] = new Array(); 
users = [
    tsp, hjp, bbo
]
function findUser(username : string) : User {
    for (let i = 0; i < users.length; i++)  {
        let u : User = users[i];
        if (u.getUsername() === username)   return u;
    }
}
*/
userRouter.get('', (req: Request, resp: Response) => {
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

userRouter.get('/username/:username', (req: Request, resp: Response) =>    {
    const username : string = req.params.username;
    console.log(`retrieving user with the name ${username}`);
    userService.findUserByUsername(username)
        .then(data => {
            console.log(data);
            resp.json(data.Items[0]);
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        })
});

function validUser(questionable : User) : boolean {
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

userRouter.post('',(req: Request, resp: Response) =>   {
    console.log(`adding user: ${JSON.stringify(req.body)}
    to users`);
    if (!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.role)   {
        resp.sendStatus(400);
    } //If a parameter is missing, bad request
    const u = new User(req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.email, req.body.role);
    if (validUser(u) === false) { resp.sendStatus(400); }
    else {
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

/*userRouter.put('',(req: Request, resp: Response) =>   {
    const myUserRequest = new Request(`get/user/username/${req.body.username}`);
    let userResult = fetch(myUserRequest).then(function(response) {
        if (response.status === 400) resp.sendStatus(404);
    }); //If the user isn't in the database, then the user wasn't found
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
*/
userRouter.delete('/delete/:username', (req: Request, resp: Response) =>    {
    userService.removeuser(req.params.username)
        .then(data => {
            resp.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        })
})