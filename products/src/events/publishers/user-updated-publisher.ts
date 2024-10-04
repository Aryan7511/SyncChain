import { Publisher } from './base-publisher';
import { UserUpdatedEvent } from '../event-types/user-updated-event';
import { Subjects } from '../subjects';

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  readonly subject = Subjects.UserUpdated;
}
