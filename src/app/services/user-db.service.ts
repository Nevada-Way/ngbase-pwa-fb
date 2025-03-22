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
      // Opting for firebase auto gen key we need the path to the root of the
      // users tree.
      //  The last part of the path will be added automatically by FB
      // when we call the the createEntry() method.
      fullPathToUserId =
        pathOfUsersTree /* Later on the fb generated user-id will be appended */;
    } else {
      // Opting for programatically naming the object's root we need to
      // concatinate to the end of the path the value of the [my data object].userId .
      fullPathToUserId = pathOfUsersTree + '/' + newDataObject.userId;
    }

    ////////////////////////////////////////////////////
    // Creating the new user object in real time database
    // FYI: The 'createEntry()' will implement the naming of the object's root
    //      based on the value of the 'iWantFbToGenerateTheRootObjectId' parameter.
    ////////////////////////////////////////////////////
    try {
      // Create a new entry in the database
      const keyOfNewUserInDb: string = await this.createEntry<UserInfoModel>(
        fullPathToUserId,
        newDataObject,

        iWantFbToGenerateTheRootObjectId // Value of createEntry() 's useFbCustomId
        // if true then the value of the object's root
        // will be the FB auto generated key (i.e. '-OLpCHj-Kp9MtSps2JEB')
        // but if false then id is the value of the path's last part, i.e. if
        // path is '/users/lala/user-23' then the name of the object's root
        // will be 'user-23'
      );

      /////////////////////////////////////////////////
      // Managing the option to update the 'userId' property
      // Now that we have the user object in the database we need
      // make sure that the value of userId is same as the value of the root key.
      // If we opted for for programatically naming the object's root then
      // we dont need to do anything, because the object was created with the
      // correct key value by the last part of the path.
      // But in case we opted for the FB auto-generated key we can only now
      // use the value we got from the createEntry() method and update the
      // 'userId' property of the object.
      /////////////////////////////////////////////////
      if (iWantFbToGenerateTheRootObjectId) {
        //Now that we have the FB auto generated key we can
        // calculate the path to the newly created object
        fullPathToUserId = pathOfUsersTree + '/' + keyOfNewUserInDb;

        // And now we can also update the value of the 'userId' property
        const updatedUserData = { userId: keyOfNewUserInDb };
        await this.updateEntry(fullPathToUserId, updatedUserData);
      }

      return keyOfNewUserInDb;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}
