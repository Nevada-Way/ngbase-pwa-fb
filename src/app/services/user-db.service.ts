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

  /**
   * No matter wich opton you choose the 'userId' property of the 'originalUserDataObject'
   * will be updated with the value of the newly created entry's key.
   *
   * @param originalUserDataObject
   * @param appendTimestampToMyDataObject
   * @param iWantFbToGenerateTheRootObjectId
   * @returns
   */
  async createNewUser(
    originalUserDataObject: UserInfoModel,
    appendTimestampToMyDataObject: boolean, // Controls wether to add a timestamp to the entry
    iWantFbToGenerateTheRootObjectId: boolean
  ): Promise<string> {
    /////////////////////////////////////////////////
    // Managing the option to append a timestamp
    let newDataObject;
    if (appendTimestampToMyDataObject) {
      newDataObject = await this.appendFbUnixTimestampToObject(
        originalUserDataObject
      );
      console.log(
        'createNewUser() Want timestamp case: newDataObject:',
        newDataObject
      );
    } else {
      newDataObject = originalUserDataObject;
      console.log(
        'createNewUser(): No timestamp case: newDataObject:',
        newDataObject
      );
    }

    ////////////////////////////////////////////////////
    // Preping the path parameter
    ////////////////////////////////////////////////////
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
      fullPathToUserId = pathOfUsersTree + '/' + newDataObject.userId;
    }

    try {
      // Create a new entry in the database
      const autoGenFirebaseKey: string = await this.createEntry<UserInfoModel>(
        fullPathToUserId,
        newDataObject,

        iWantFbToGenerateTheRootObjectId // Value of createEntry() 's useFbCustomId
        // if true then the value of the object's root
        // will be the FB auto generated key (i.e. '-OLpCHj-Kp9MtSps2JEB')
        // but if false then id is the value of the path's last part, i.e. if
        // path is '/users/lala/user-23' then the name of the object's root
        // will be 'user-23'
      );

      if (iWantFbToGenerateTheRootObjectId) {
        //Now that we have the FB auto generated key we can
        // calculate the path to the newly created object
        fullPathToUserId = pathOfUsersTree + '/' + autoGenFirebaseKey;

        // And now we can also update the value of the 'userId' property
        const updatedUserData = { userId: autoGenFirebaseKey };
        await this.updateEntry(fullPathToUserId, updatedUserData);
      }
      ////// This section will update the userDataObject.userId with the entryAutoId
      // That way our userId will have the same unique value of the location
      //  reference it is stored in the database.
      // const updatedUserData = {
      //   ...newDataObject,
      //   userId: autoGenFirebaseKey,
      // };

      // Update the entry in the database with the updated data
      //await this.completeOverwriteEntry(fullPathToUserId, updatedUserData);
      //}

      return autoGenFirebaseKey;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}
