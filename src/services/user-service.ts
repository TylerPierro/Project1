import * as userDao from '../dao/user-dao';
import { User } from '../beans/User';

export function retrieveAllUsers()  {
    return userDao.retrieveAllUsers();
}
export function findUserByUsername(username: string) {
    return userDao.findUserByUsername(username);
}

export function createUser(newUser: User) {
    return userDao.createUser(newUser);
}

export function removeuser(username: string) {
    return userDao.removeUser(username);
}

export function updateUser(u : User) {
    return userDao.updateUser(u);
}