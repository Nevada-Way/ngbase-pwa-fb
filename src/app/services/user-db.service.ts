import { Injectable } from '@angular/core';
import { RealtimeDbService } from './rtdb.service'; // Assuming your RealtimeDbService is in the same directory
import { UserInfoModel } from '../models/user.model';
import { ref } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class UserDbService extends RealtimeDbService {
  constructor(private realtimeDbService: RealtimeDbService) {
    super(realtimeDbService['database']);
  }

  async createNewUser(userDataObject: UserInfoModel): Promise<string> {
    try {
      // The entryAutoId will be the key auto-generated by Firebase
      // where the new entry object (userDataObject) will be stored.
      const newEntryFirebaseId = await this.createEntry<UserInfoModel>(
        'users/',
        userDataObject,
        false, // If false no FB timestamp will be added to the userDataObject
        true // Value of useFbCustomId if true uses path as is, if false uses FB auto gen ID
      );

      ////// This section will update the userDataObject.userId with the entryAutoId
      // That way our userId will have the same unique value of the location
      //  reference it is stored in the database.
      const updatedUserData = {
        ...userDataObject,
        userId: newEntryFirebaseId,
      };

      // Update the entry in the database with the updated data
      await this.updateEntry('users/' + newEntryFirebaseId, updatedUserData);

      return newEntryFirebaseId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}
