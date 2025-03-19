import { Injectable } from '@angular/core';
import { RealtimeDbService } from './rtdb.service'; // Assuming your RealtimeDbService is in the same directory
import { UserInfoModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserDbService extends RealtimeDbService {
  constructor(private realtimeDbService: RealtimeDbService) {
    super(realtimeDbService['database']);
  }

  async createNewUser(userDataObject: UserInfoModel): Promise<string> {
    try {
      // Assuming your user data is stored under the 'users' path
      const userKey = await this.createEntry<UserInfoModel>(
        'users/my-id',
        userDataObject,
        false, // If false no FB timestamp will be added to the userDataObject
        true // Value of useFbCustomId if true uses path as is, if false uses FB auto gen ID
      );
      return userKey;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}
