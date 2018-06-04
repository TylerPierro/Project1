import express, { Request, Response, NextFunction } from 'express';
import { get, request } from 'http';
import session from 'express-session';
import { Reimbursement, ReimbursementItem } from './Reimbursement';
import { User } from './User';
import { users } from './user-router';

export const sessionRouter = express.Router();

/*sessionRouter.get('/', function (req,res,next)    {
    var sessData = req.session;
    sessData.someAttribute = "foo";
    res.send('Return with some text');
})*/