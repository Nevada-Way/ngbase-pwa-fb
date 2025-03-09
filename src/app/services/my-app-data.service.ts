import { Injectable } from '@angular/core';
import { MyAppLogModel } from '../models/log.model';
import { FirestoreService } from './firestore.service';
import { Firestore, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MyAppDataService extends FirestoreService {
  // The reason the functions in FirestoreService are 'protected'
  // is so that we can seperate them from the app (Seperation of concerns).
  //
  // That way if we ever want to switch from Firebase to
  // another data source (even local filesystem) we just need to
  // extend this class MyAppDataService by another service
  // that has identical function name and arguments (interface).

  constructor(firestore: Firestore) {
    //Call the base class constructor
    super(firestore);
  }

  ///////////////////////////////////////////
  // The app specific CRUD functions below //
  // For each different app you need a     //
  // different version of these functions  //
  //////////////////////////////////////////

  public async addNewLogEntry(
    collectionName: string,
    userIdNumber: number,
    logMessage: string
    //addTimestamp: boolean
  ): Promise<string> {
    const logObject: MyAppLogModel = {
      logUserIdNumber: userIdNumber,
      logMessage: logMessage,
      logTimestamp: Timestamp.now(), // Add or overwrite timeLogged with the timestamp
    };

    const result: Promise<string> = this.createDocument(
      collectionName,
      logObject,
      false // true to auto create a timestamp, otherwise no timestamp
    );
    return result;
  }

  /**
   * Retrieves a log item by its document ID.
   *
   * This function fetches a specific log item from Firestore using the provided document ID.
   * It utilizes the inherited `getDocument` method from `FirestoreService`.
   *
   * @param docItemId The document ID of the log item to retrieve.
   * @returns A Promise that resolves with the `MyAppLogModel` if found, or `null` if not found or an error occurs.
   * @throws Errors logged to the console if there are issues retrieving the document.
   */
  public async getLogItemById(
    docItemId: string
  ): Promise<MyAppLogModel | null> {
    try {
      const logItemDoc =
        /*We use 'this' because this class 'DataAccessService' extends FirestoreService */
        await this.getDocument<MyAppLogModel>(docItemId); // old example: 'budget/ni3RFtRqRuRWalX3gVBQ'

      console.log('getLogItemById() is returning this :', logItemDoc);
      return logItemDoc;
    } catch (error) {
      console.error('Error trying to get a doc using getLogItemById:', error);
      return null; // Return null to indicate failure
    }
  }

  public async updateLogItem(
    docItemId: string,
    newItemData: Partial<MyAppLogModel>
  ): Promise<void> {
    newItemData.logTimestamp = Timestamp.now();
    try {
      await this.updateDocument<MyAppLogModel>(
        docItemId /* 'budget/ni3RFtRqRuRWalX3gVBQ' */,
        newItemData
      );
      console.log('updateLogItem() updated successfully : ', newItemData);
    } catch (error) {
      console.error(`Error updating log item id "${docItemId}" :`, error);
      throw error; // Re-throw the error to be handled by the caller if needed
    }
  }

  public async deleteLogEntry() {}
}
