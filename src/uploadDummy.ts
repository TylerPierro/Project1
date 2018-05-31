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
    /*arr[i].items = new ReimbursementItem(arr[i].items.title, arr[i].items.amount, arr[i].items.description, arr[i].items.timeOfExpense);
    let cu = new Reimbursement(arr[i].username, arr[i].timeSubmitted, arr[i].items, arr[i].approver, arr[i].status, arr[i].receipts);
    //console.log(`saving ${i}: ${cu.getUsername()}, ${cu.getTimeSubmitted()}, ${cu.getItems()}`);
    console.log(`saving ${i}: ${JSON.stringify(cu)}`)
    reimbursementDao.saveReimbursement(JSON.stringify(cu))*/
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
/*
/*fs.readFile(__dirname + '/dao/dummydata/dummy-user-data.json', 'utf8', (err,data) =>   {
    const user = JSON.parse(data); //Create an array of movie objects from the string
    recursiveSave(user, 0);
});

function recursiveSave(arr, i)  {
    console.log(`saving ${i}: ${arr[i].username}`);
    userDao.saveUser(arr[i])
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
}*/