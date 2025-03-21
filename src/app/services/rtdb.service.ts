import { Injectable } from '@angular/core';
import {
  Database,
  ref,
  push,
  set,
  serverTimestamp,
  DatabaseReference,
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class RealtimeDbService {
  constructor(
    private database: Database /* Database is the name of FB RTDB */
  ) {}

  /**
   * Creates a new entry in a Realtime Database path.
   *
   * This function adds a new entry to the specified Realtime Database path.
   * It has two optional features: that can be turned on or off:
   *
   * (1) addTimestamp : Controls the option to automatically append a property
   *     named 'timeStamped'to the input data object.
   *
   * (2) useFbCustomId : Controls the option to use a FB unique chronological ordered
   *     name for the object root or to use the name given by the 'path' input parameter.
   *
   * @template T The type of the entry data.
   * @param path The Realtime Database path to add the entry to.
   * @param data The data for the new entry.
   * @param addTimestamp A boolean indicating whether to add a timestamp to the entry.
   * @param generateFbUniqueKey A boolean indicating whether to use the FB auto gen ID.
   *
   * @returns A Promise that resolves with the key <string> of the newly created entry.
   *
   *          If generateFbUniqueKey is true then the name of the object's root
   *          will be like '-OLpCHj-Kp9MtSps2JEB' otherwise (if false) the name will
   *          be the the name of the last part of the path parameter.
   *          For example if path is 'allUsers/user-23' then the name of the object's
   *          root  will be 'user-23'
   *
   * @throws An error if the entry creation fails.
   */
  protected async createEntry<T>(
    path: string,
    data: T,
    addTimestamp: boolean, // Controls wether to add a timestamp to the entry
    generateFbUniqueKey: boolean // Controls wether to use the 'path' as is or to use FB auto gen ID
  ): Promise<string> {
    try {
      /////////////////////////////////////////////////////////////////
      // STEP-1: Preping the data object we want to write to the database.
      // Here we determin if to append a timestamp property to the input
      // data object by the true/false value of the 'addTimestamp' parameter.
      const newData = addTimestamp
        ? {
            ...data,
            timeStamped: serverTimestamp(), // Add or overwrite timeStamped with the server timestamp
          }
        : data; //Case we dont opt for timestampo so the original input data is used

      /////////////////////////////////////////////////////////////////
      // STEP-2: Create a placeholder reference to the inputed path
      //         FYI: If we use this value to set() the data object then the
      //         name of the root of the object (the key) will be the last part
      //         of the path parameter.
      //         For example if path is 'allUsers/user-23' then
      //         the name of the object's root  will be 'user-23'
      const entryRef: DatabaseReference = ref(this.database, path);

      /////////////////////////////////////////////////////////////////
      // STEP-3: Decide on the value of the new entry's key
      //         and create a new entry reference with that key.
      //      We have two options here:
      //      (A) If generateFbUniqueKey is true then we will let Firebase
      //          create a unique key using the push() method.
      //      (B) Otherwise (case false) then we will use the last part of the
      //          path parameter as the key of the new entry.
      let newerEntryRef: DatabaseReference | null = null;

      if (generateFbUniqueKey) {
        // STEP-3A :
        // Case (A) when generateFbUniqueKey is true so we invoke the
        // push() method to have Firebase create the key.
        // We need to use the 'entryRef' value so that firebase will know for what
        // object we want the unique key. We use entryRef because it was created
        // with the path parameter for the specific data object.

        newerEntryRef = push(entryRef); // Genreating a unique chronological key value
      } else {
        // STEP-3B :
        // Case (B) when generateFbUniqueKey is false so we use the last part of the
        // path parameter as the key of the new entry.
        //
        console.log('In option 3B, using The path is : ', path);
        newerEntryRef = entryRef;
      }

      // Making sure 'newerEntryRef' exists for the next step
      if (!newerEntryRef) {
        throw new Error(
          'Could not retrieve a refrence to the new entry from Realtime Database.'
        );
      }

      /////////////////////////////////////////////////////////////////
      // STEP-4: Write the data object to the database  using the
      //         reference to the new entry (for either of cases (A) or (B) above).
      await set(newerEntryRef, newData); // Writing the data object to the database

      // TODO 2025.03.21.19.29 MAKE SURE WORKS IN BOTH CASES

      const newEntryKey = newerEntryRef.key;

      // Making sure we have a key to return to this function's caller
      if (!newEntryKey) {
        throw new Error(
          'Could not retrieve entry key from Realtime Database even though the entry was created successfully.'
        );
      }

      return newEntryKey;
    } catch (error) {
      console.error('Error creating Realtime Database entry:', error);
      throw error;
    }
  }

  protected async updateEntry<T>(path: string, data: T): Promise<void> {
    try {
      const entryRef = ref(this.database, path);
      await set(entryRef, data);
    } catch (error) {
      console.error('Error updating Realtime Database entry:', error);
      throw error;
    }
  }
}
