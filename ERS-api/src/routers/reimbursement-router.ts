import express, { Request, Response } from 'express';
import * as reimbursementService from '../services/reimbursement-service';
import { Reimbursement, ReimbursementItem } from '../beans/Reimbursement';
import { User } from '../beans/User';

export const reimbursementRouter = express.Router();

/*reimbursementRouter.get('', (req: Request, resp: Response) => {
    console.log('retrieving all reimbursements');
    resp.json(reimbursements);
});
*/
reimbursementRouter.get('/username/:username', (req: Request, resp: Response) =>    {
    const username = req.params.username;
    console.log(`retrieving remimbursements for user: ${username}`);
    reimbursementService.findReimbursementsByUsername(username)
        .then(data => {
            resp.json(data.Items);
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        });
});

reimbursementRouter.get('/status/:status', (req: Request, resp: Response) =>    {
    const status = req.params.status;
    console.log(`retrieving remimbursements with status: ${status}`);
    reimbursementService.findReimbursementsByStatus(status)
        .then(data => {
            resp.json(data.Items);
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        });
});

function validReimbursement(r : Reimbursement) : boolean {
    let isValid = true;
    /*const fetchUrl = require("fetch").fetchURL;
    fetchUrl('http://localhost:3000/users/')
        .then(resp => resp.json())
        .then((reimbursements) => {
            // clear table
            //   const body = document.getElementById('movie-table-body');
            //   body.innerHTML = '';

            // populate the table for each movie
            reimbursements.forEach(ri => {
                if(ri.getUsername() === req.body.username) { userRequest = true; }
                if(ri.getUsername() === req.body.approver) { adminRequest = true; }
            });
        })
        .catch(err => {
            console.log(err);
        });*/
    if (!(r.getStatus() === 'approved' || r.getStatus() === 'denied' || r.getStatus() === 'pending')) {
        return false;
    } //If the status isn't approved or denied, bad request
    /*else if (userRequest === false || adminRequest === false) {
        resp.sendStatus(404);
    } //If either the user or the admin isn't a real user*/
    else if (r.getTimeSubmitted() > Date.now())  {
        return false;
    } //That date hasn't happened yet
    else return true;
}

reimbursementRouter.post('',(req: Request, resp: Response) =>   {
    let userRequest : boolean = false;
    let adminRequest : boolean = false;
    
    if (!req.body.username || !req.body.timeSubmitted || !req.body.items || !req.body.approver || !req.body.status || !req.body.receipts)   {
        resp.sendStatus(400); 
    }

    let options = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"};
    let now = new Date(Date.now()).toLocaleDateString("en-US", options);
    const r = new Reimbursement(req.body.username, req.body.timeSubmitted, req.body.items, req.body.approver, req.body.status, req.body.receipts);
    console.log(`adding reimbursement: ${JSON.stringify(req.body)}
        to reimbursements`);
    /*const fetchUrl = require("fetch").fetchURL;
    fetchUrl('http://localhost:3000/users/')
        .then(resp => resp.json())
        .then((reimbursements) => {
            // clear table
            //   const body = document.getElementById('movie-table-body');
            //   body.innerHTML = '';

            // populate the table for each movie
            reimbursements.forEach(ri => {
                if(ri.getUsername() === req.body.username) { userRequest = true; }
                if(ri.getUsername() === req.body.approver) { adminRequest = true; }
            });
        })
        .catch(err => {
            console.log(err);
        });
        else if (!(req.body.status === 'approved' || req.body.status === 'denied' || req.body.status === 'pending')) {
            resp.sendStatus(428);
        } //If the status isn't approved or denied, bad request
        else if (userRequest === false || adminRequest === false) {
            resp.sendStatus(404);
        } //If either the user or the admin isn't a real user
        else if (req.body.timeSubmitted > Date.now())  {
            resp.sendStatus(400);
        } //That date hasn't happened yet*/
    
    if (!validReimbursement) { resp.sendStatus(400); }
    else {
        reimbursementService.createReimbursement(r)
            .then(data => {
                resp.json(data);
            })
            .catch(err => {
                console.log(err);
                resp.sendStatus(500);
            })
    }
});

reimbursementRouter.put('/username/:username', (req: Request, resp: Response) => {
    let userRequest : boolean = false;
    let adminRequest : boolean = false;
    if (!req.body.username || !req.body.timeSubmitted || !req.body.items || !req.body.approver || !req.body.status || !req.body.receipts)   {
        resp.sendStatus(400); 
    }
    const r = new Reimbursement(req.params.username, req.body.timeSubmitted, req.body.items, req.body.approver, req.body.status, req.body.receipts);
    console.log(`Updating reimbursement: ${JSON.stringify(req.body)}
        in reimbursements`);
    
    if (!validReimbursement) { resp.sendStatus(400); }
    else {
        reimbursementService.updateReimbursement(r)
            .then(data => {
                resp.json(data);
            })
            .catch(err => {
                console.log(err);
                resp.sendStatus(500);
            })
    }
});
 
reimbursementRouter.delete('/delete/username/:username/timestamp/:timestamp', (req: Request, resp: Response) =>    {
    const username = req.params.username;
    const timeSubmitted = req.params.timeSubmitted;
    console.log(`deleting remimbursements for user: ${username}`);
    reimbursementService.removeReimbursement(username,timeSubmitted)
        .then(data => {
            resp.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            resp.sendStatus(500);
        });
})