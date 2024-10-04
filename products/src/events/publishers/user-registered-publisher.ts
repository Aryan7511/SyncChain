import { Publisher } from './base-publisher';
import { UserRegisteredEvent } from '../event-types/user-registered-event';
import { Subjects } from '../subjects';

export class UserRegisteredPublisher extends Publisher<UserRegisteredEvent> {
  readonly subject = Subjects.UserRegistered;
}
  