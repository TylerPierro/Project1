import aws from 'aws-sdk';
import {ConfigurationOptions} from 'aws-sdk/lib/config';
import {User} from '../beans/User';
const awsConfig : ConfigurationOptions = {
    region : 'us-east-2',
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
}

aws.config.update(awsConfig);

const dynamodb = new aws.DynamoDB();
const docClient = new aws.DynamoDB.DocumentClient();

export function createUserTable()  {
    dynamodb.createTable({
        TableName: 'users',
        KeySchema: [
            {AttributeName: 'username', KeyType: 'HASH'}
        ],
        AttributeDefinitions: [
            {AttributeName: 'username', AttributeType: 'S'}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2
        }
    }, (err,data) => {
        if(err)  { 
            console.log(`Unable to create table: \n ${JSON.stringify(err,undefined,2)}`);
        } else {
            console.log(`Created table: \n ${JSON.stringify(data,undefined,2)}`);
        }
    });
}

export function saveUser(user) : Promise<any> {
    return docClient.put({
        TableName : 'users',
        Item : user
    }).promise();
}

export function retrieveAllUsers(): Promise<any>   {
    return docClient.scan({
        TableName: 'users',
    }).promise();
}

export function findUserByUsername(username: string): Promise<any>  {
    return docClient.query({
        TableName: 'users',
        KeyConditionExpression: '#usr = :uuuu',
        ExpressionAttributeNames: {
            '#usr': 'username'
        },
        ExpressionAttributeValues: {
            ':uuuu': username
        },
    }).promise();
}

export function createUser(newUser : User): Promise<any> {
    return docClient.put({
        TableName: 'users',
        Item: newUser
    }).promise();
}

export function updateUser(updatedUser : User): Promise<any> {
    return docClient.update({
        TableName: 'users',
        Key: {
            username: updatedUser.getUsername()
        },
        UpdateExpression: 'set #pass = :p, #em = :e, #ro = :r',
        ExpressionAttributeNames: {
            '#pass': 'password',
            '#em': 'email',
            '#ro': 'role'
        },
        ExpressionAttributeValues: {
            ':p': updatedUser.getPassword(),
            ':e': updatedUser.getEmail(),
            ':r': updatedUser.getRole()
        },
        ReturnValues: 'UPDATED_NEW'
    }).promise();
}

export function removeUser(username: string): Promise<any> {
    return docClient.delete({
        TableName: 'users',
        Key: {
            username: username
        }
    }).promise();
}