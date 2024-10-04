import { Subjects } from '../subjects';

export interface UserRegisteredEvent {
  subject: Subjects.UserRegistered;
  data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    location: string;
    contactNumber: string;
  };
}
