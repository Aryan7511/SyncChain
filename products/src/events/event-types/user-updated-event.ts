import { Subjects } from '../subjects';

export interface UserUpdatedEvent {
  subject: Subjects.UserUpdated;
  data: {
    userId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    location?: string;
    contactNumber?: string;
  };
}
