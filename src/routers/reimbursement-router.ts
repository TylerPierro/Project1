import express, { Request, Response } from 'express';
import { get, request } from 'http';
import { Reimbursement, ReimbursementItem } from './Reimbursement';
import { User } from './User';
import { users } from './user-router';

export const reimbursementRouter = express.Router();

let tspVirginiari1 : ReimbursementItem = new ReimbursementItem('Taxi1', 53.24, 'Fare to the airport', 'May 25, 2018 8:00 AM');
let tspVirginiari2 : ReimbursementItem = new ReimbursementItem('Airplane', 432.27, 'Round trip air fare', 'May 25, 2018 9:00 AM');
let tspVirginiari3 : ReimbursementItem = new ReimbursementItem('Lodging', 132.00, 'Hotel fee', 'May 26, 2018 7:00 AM');
let tsp : Reimbursement = new Reimbursement('TyPiRo', 'November 1, 1997 10:15 AM', [tspVirginiari1, tspVirginiari2, tspVirginiari3], 'HoJo', 'approved', []);
let bb : Reimbursement = new Reimbursement('BillyBob', 'January 3, 2004 3:30 PM', [/*ticket*/], 'HoJo', 'denied', []);
let reimbursements : Reimbursement[] = new Array(); 
reimbursements = [
    tsp, bb
]

reimbursementRouter.get('', (req: Request, resp: Response) => {
    console.log('retrieving all reimbursements');
    resp.json(reimbursements);
});

reimbursementRouter.get('/username/:username', (req: Request, resp: Response) =>    {
    const reimbursement = req.params.username;
    console.log(`retrieving remimbursements for user: ${reimbursement}`);
    let rArray : Reimbursement[] = [];
    for (let r of reimbursements)    {
        if (r.getUsername() === reimbursement)   rArray.push(r);
    }
    resp.json(rArray);
});

reimbursementRouter.get('/status/:status', (req: Request, resp: Response) =>    {
    const reimbursement = req.params.status;
    console.log(`retrieving remimbursements with status: ${reimbursement}`);
    let rArray : Reimbursement[] = [];
    for (let r of reimbursements)    {
        if (r.getStatus() === reimbursement)   rArray.push(r);
    }
    resp.json(rArray);
});

reimbursementRouter.post('',(req: Request, resp: Response) =>   {
    console.log(`adding reimbursement: ${JSON.stringify(req.body)}
    to reimbursements`);
    if (!req.body.username || !req.body.timeSubmitted || !req.body.items || !req.body.approver || !req.body.status || !req.body.receipts)   {
        resp.sendStatus(400); 
    }
    let userRequest : boolean = false;
    let adminRequest : boolean = false;
    let submissionDate : Date = new Date(Date.parse(req.body.timeSubmitted));
    let currentDate : Date = new Date(Date.now());
    for (let i = 0; i<users.length; i++)    {
        if (userRequest && adminRequest) { break; }
        if (users[i].getUsername() === req.body.username) { userRequest = true; }
        if (users[i].getUsername() === req.body.approver) { adminRequest = true; }
    } //If the user or the admin isn't in the user list, they aren't found
    if (!(req.body.status === 'approved' || req.body.status === 'denied')) {
        resp.sendStatus(428);
    } //If the status isn't approved or denied, bad request*/
    else if (userRequest === false || adminRequest === false) {
        resp.sendStatus(404);
    }
    else if (submissionDate > currentDate)  {
        resp.sendStatus(400);
    } //That date hasn't happened yet
    else {
        const r = new Reimbursement(req.body.username, req.body.timeSubmitted, req.body.items, req.body.approver, req.body.status, req.body.receipts);
        reimbursements.push(r); 
        resp.sendStatus(201);
    }
});

reimbursementRouter.delete('/delete/:reimbursement', (req: Request, resp: Response) =>    {
    reimbursements = reimbursements.filter((r) => r.getUsername() !== req.params.reimbursement);
    resp.end();
})