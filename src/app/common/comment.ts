import { User } from './user';

export class Comment {
  // tslint:disable-next-line: variable-name
  comment_id: number;
  message: string;
  dateCreated: Date;
  author: User;
}
