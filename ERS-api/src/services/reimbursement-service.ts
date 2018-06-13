import * as reimbursementDao from '../dao/reimbursement-dao';
import { Reimbursement } from '../beans/Reimbursement';

export function findReimbursementsByStatus(status: string)  {
    return reimbursementDao.findReimbursementsByStatus(status);
}

export function findReimbursementsByUsername(username: string) {
    return reimbursementDao.findReimbursementsByUsername(username);
}

export function findIndividualReimbursements(username: string, timeSubmitted: number) {
    return reimbursementDao.findIndividualReimbursement(username, timeSubmitted);
}

export function createReimbursement(ri: Reimbursement) {
    return reimbursementDao.createReimbursement(ri);
}

export function updateReimbursement(updatedReimbursement: Reimbursement) {
    return reimbursementDao.updateReimbursement(updatedReimbursement);
}

export function removeReimbursement(username: string, timeSubmitted: number)   {
    return reimbursementDao.removeReimbursement(username, timeSubmitted);
}