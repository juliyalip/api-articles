import {Role} from '../../model/user-model'
import { ObjectId } from 'mongodb';

export default class UserDTO {
id: ObjectId;
name: string;
role: Role;
constructor(user: {id: ObjectId, role: Role, name: string}){
    this.id = user.id;
    this.role = user.role;
    this.name = user.name
}
}