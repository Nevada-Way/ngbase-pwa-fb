import { Timestamp } from '@angular/fire/firestore';

export interface MyAppLogModel {
  logUserIdNumber: number;
  logMessage: string;
  logTimestamp: Timestamp;
}
