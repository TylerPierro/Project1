import aws from 'aws-sdk';
import {ConfigurationOptions} from 'aws-sdk/lib/config';
import {User} from '../beans/User';
import { Reimbursement } from '../beans/Reimbursement';
const awsConfig : ConfigurationOptions = {
    region : 'us-east-2',
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
}

aws.config.update(awsConfig);

const dynamodb = new aws.DynamoDB();
const docClient = new aws.DynamoDB.DocumentClient();

export function createReimbursementTable()  {
    dynamodb.createTable({
        TableName: 'reimbursements',
        KeySchema: [
            {AttributeName: 'username', KeyType: 'HASH'},
            {AttributeName: 'timestamp', KeyType: 'RANGE'}
        ],
        AttributeDefinitions: [
            {AttributeName: 'username', AttributeType: 'S'},
            {AttributeName: 'timestamp', AttributeType: 'S'}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 11,
            WriteCapacityUnits: 10
        }
    }, (err,data) => {
        if(err)  { 
            console.log(`Unable to create table: \n ${JSON.stringify(err,undefined,2)}`);
        } else {
            console.log(`Created table: \n ${JSON.stringify(data,undefined,2)}`);
        }
    });
}

export function saveReimbursement(reimbursement) : Promise<any> {
    return docClient.put({
        TableName : 'reimbursements',
        Item : reimbursement
    }).promise();
}

export function findReimbursementsByStatus(status: string): Promise<any>   {
    return docClient.query({
        TableName: 'reimbursements',
        IndexName: 'status-timeSubmitted-index',
        KeyConditionExpression: '#stat = :ssss',
        ExpressionAttributeNames: {
            '#stat': 'status'
        },
        ExpressionAttributeValues: {
            ':ssss': status
        }
    }).promise();
}

export function findReimbursementsByUsername(username: string): Promise<any>  {
    return docClient.query({
        TableName: 'reimbursements',
        KeyConditionExpression: '#usr = :uuuu',
        ExpressionAttributeNames: {
            '#usr': 'username'
        },
        ExpressionAttributeValues: {
            ':uuuu': username
        },
    }).promise();
}

export function findIndividualReimbursement(username: string, timeSubmitted: number) {
    return docClient.get({
        TableName: 'reimbursements',
        Key: {
            'username': username,
            'timeSubmitted': timeSubmitted
        }
    }).promise();
}

export function createReimbursement(newReimbursement : Reimbursement): Promise<any> {
    return docClient.put({
        TableName: 'reimbursements',
        Item: newReimbursement
    }).promise();
} 

export function updateReimbursement(updatedReimbursement : Reimbursement): Promise<any> {
    return docClient.update({
        TableName: 'reimbursements',
        Key: {
            username: updatedReimbursement.getUsername(),
            timeSubmitted: updatedReimbursement.getTimeSubmitted()
        },
        UpdateExpression: 'set #itm = :i, #app = :a, #stat = :s, #rec = :r',
        ExpressionAttributeNames: {
            '#itm': 'items',
            '#app': 'approver',
            '#stat': 'status',
            '#rec': 'receipts'
        },
        ExpressionAttributeValues: {
            ':i': updatedReimbursement.getItems(),
            ':a': updatedReimbursement.getApprover(),
            ':s': updatedReimbursement.getStatus(),
            ':r': updatedReimbursement.getReceipts()
        },
        ReturnValues: 'UPDATED_NEW'
    }).promise();
}

export function removeReimbursement(username: string, timeSubmitted: number): Promise<any> {
    return docClient.delete({
        TableName: 'reimbursements',
        Key: {
            username: username,
            timeSubmitted: timeSubmitted
        }
    }).promise();
}