import express, { Request, Response, NextFunction } from 'express';
import { get, request } from 'http';
import session from 'express-session';

export const sessionRouter = express.Router();

/*sessionRouter.get('/', function (req,res,next)    {
    var sessData = req.session;
    sessData.someAttribute = "foo";
    res.send('Return with some text');
})*/