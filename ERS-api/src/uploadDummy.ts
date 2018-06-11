import fs from 'fs';
import * as reimbursementDao from './dao/reimbursement-dao';
import * as userDao from './dao/user-dao';
import { User } from './beans/User';
import { Reimbursement, ReimbursementItem } from './beans/Reimbursement';

fs.readFile(__dirname + '/dao/dummydata/dummy-reimnumber-data.json', 'utf8', (err,data) =>   {
    const reimbursements = JSON.parse(data); //Create an array of movie objects from the string
    recursiveSave(reimbursements, 0);
});

function recursiveSave(arr, i)  {
    console.log(`saving ${i}: ${arr[i].username}`);
    reimbursementDao.saveReimbursement(arr[i])
        .then(() => {
            if(i >= arr.length-1) {
                console.log('done');
                return;
            }
            i++;
            recursiveSave(arr,i);
        })
        .catch(() => {
            if(i >= arr.length-1) {
                console.log('done');
                return;
            }
            i++;
            recursiveSave(arr,i);
        })
}