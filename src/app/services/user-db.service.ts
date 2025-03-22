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

  async createNewUser(
    userDataObject: UserInfoModel,
    appendTimestampToMyDataObject: boolean,
    iWantFbToGenerateTheRootObjectId: boolean
  ): Promise<string> {
    const pathOfUsersTree = '/my-users/';
    //const appendTimestampToMyDataObject = false;

    let fullPathToUserId;
    if (iWantFbToGenerateTheRootObjectId) {
      fullPathToUserId =
        pathOfUsersTree /* Later on the fb generated user-id will be appended */;
    } else {
      // If you want to test the option where the object's root is named with
      // by your own custom user id name then use the 'fullPathToUserId' below.
      // Notice that the last part of the path has the value of the id in the
      // 'userDataObject.userId' parameter.
      // BUT if you use your own custom id then turn off the value of the
      // 'useFbCustomId' parameter in the 'createEntry' method below.
      fullPathToUserId = pathOfUsersTree + '/' + userDataObject.userId;
    }

    try {
      // Create a new entry in the database
      const autoGenFirebaseKey = await this.createEntry<UserInfoModel>(
        fullPathToUserId,
        userDataObject,

        appendTimestampToMyDataObject, // If false no FB timestamp will
        // be added to the userDataObject BUT only works if the
        // iWantFbToGenerateTheRootObjectId == false.
        // TODO : I need to isolate the "appending timestamp to data object"
        // as a separate method. Then i can take it out of the generic createEntry()
        // method and use it whnever i want  atimestamp appended to any onbject in any method.

        iWantFbToGenerateTheRootObjectId // Value of createEntry() 's useFbCustomId
        // if true then the value of the object's root
        // will be the FB auto generated key (i.e. '-OLpCHj-Kp9MtSps2JEB')
        // but if false then id is the value of the path's last part, i.e. if
        // path is '/users/lala/user-23' then the name of the object's root
        // will be 'user-23'
      );

      if (iWantFbToGenerateTheRootObjectId) {
        ////// This section will update the userDataObject.userId with the entryAutoId
        // That way our userId will have the same unique value of the location
        //  reference it is stored in the database.
        const updatedUserData = {
          ...userDataObject,
          userId: autoGenFirebaseKey,
        };

        fullPathToUserId = pathOfUsersTree + '/' + autoGenFirebaseKey;
        // Update the entry in the database with the updated data
        await this.updateEntry(fullPathToUserId, updatedUserData);
      }

      return autoGenFirebaseKey;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}
