import { Injectable } from '@angular/core';
import {
  Database,
  ref,
  push,
  set,
  serverTimestamp,
  DatabaseReference,
  update,
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
   * This method adds a new entry to the specified Realtime Database path.
   * It has an optional feature to control how the object root key is generated.
   *
   * By setting 'generateFbUniqueKey' true/false you control wether this method
   * will use Firebase's unique chronological ordered key naming service (push())
   * or use the last part of the path parameter as the key for the new entry.
   *
   * @template T The type of the entry data.
   * @param path The Realtime Database path to add the entry to.
   * @param data The data for the new entry.
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
    generateFbUniqueKey: boolean // Controls wether to use the 'path' as is or to use FB auto gen ID
  ): Promise<string> {
    try {
      /////////////////////////////////////////////////////////////////
      // STEP-1: Create a placeholder reference to the inputed path
      //         FYI: If we use this value to set() the data object then the
      //         name of the root of the object (the key) will be the last part
      //         of the path parameter.
      //         For example if path is 'allUsers/user-23' then using set(entryRef) will
      //         give the object's root the value of 'user-23'.
      //
      const entryRef: DatabaseReference = ref(this.database, path);

      /////////////////////////////////////////////////////////////////
      // STEP-2: Decide what the objects root key value will be.
      //         whatever we choos (with generateFbUniqueKey) the
      //         value will be stored in the 'newerEntryRef' variable.
      //
      //      We have two options for 'generateFbUniqueKey':
      //      (A) If it's true then we will let Firebase
      //          create a unique key using the push() method.
      //      (B) Otherwise, when false we will use the last part of the
      //          path parameter as the key of the new entry.
      let newerEntryRef: DatabaseReference | null = null;

      if (generateFbUniqueKey) {
        //
        // Case (2A) when generateFbUniqueKey is true we invoke the
        // push() method to have Firebase create the key.
        // We need to use the 'entryRef' value so that firebase will know for what
        // object we want the unique key.
        // We use entryRef because it was created with the path parameter for
        // the specific data object.
        //
        newerEntryRef = push(entryRef); // Genreating a unique chronological key value
      } else {
        //
        // Case (2B) when generateFbUniqueKey is false we use the last part of the
        // path parameter as the key of the new entry.
        // If path is 'allUsers/user-23' then the key of the new entry will be 'user-23'.
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
      // STEP-3: Write the data object to the database  using the
      //         reference to the new entry (for either of cases (A) or (B) above).
      await set(newerEntryRef, data); // Writing the data object to the database

      // Now lets get the value of the key and return it to the caller
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

  /**
   * Updates specific properties that make up a partial part of the data
   * object of an existing entry in the Realtime Database.
   *
   * This method uses the `update()` function to modify only the provided properties
   * of the data at the specified `path`. It does not overwrite the entire entry.
   *
   * @template T The type of the data object.
   * @param path The Realtime Database path to the entry that will be updated.
   * @param data An object containing the properties to update. The type is `Partial<T>`,
   * which means only a subset of the properties from type `T` is required.
   * @returns A Promise that resolves when the update is successful, or rejects with an error.
   * @throws An error if the update operation fails.
   *
   * @example
   * // Update the user's level
   * const updateData = { userLevel: 5 };
   * await updateEntry('users/-OLpCYSTepIROyBtkr11', updateData);
   */
  protected async updateEntry<T>(
    path: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const entryRef = ref(this.database, path);
      await update(entryRef, data);
    } catch (error) {
      console.error('Error updating Realtime Database entry:', error);
      throw error;
    }
  }

  /**
   * This method completly overwrites an existing entry in the Realtime Database.
   * This in needed in the case where we want to update an entry with an object
   * that either has a different structure than the original object
   * or that most of its properties values are different.
   * @param path
   * @param data
   */
  protected async completeOverwriteEntry<T>(
    path: string,
    data: T
  ): Promise<void> {
    try {
      const entryRef = ref(this.database, path);
      await set(entryRef, data);
    } catch (error) {
      console.error('Error updating Realtime Database entry:', error);
      throw error;
    }
  }

  /**
   * This generic function takes a data object as input and appends to
   * it a property named 'timestamp' with the value of the server's timestamp.
   * @param data
   * @returns
   */
  protected async appendFbUnixTimestampToObject<T>(
    data: T
  ): Promise<T & { timestamp: object }> {
    // This const receives a value of type object { '.sv': 'timestamp' }
    // which is a special placeholder value that is used to write a
    // timestamp to the Firebase Realtime Database.
    //
    const placeHolderTimestampObject = serverTimestamp();
    //
    // When the object is written to the database this
    // object { '.sv': 'timestamp' } will be replaced by a unix
    // timestamp for example : 1629780000 of type <number>
    //
    // Unix timestamp is the number of seconds that have elapsed since
    // the Unix epoch (January 1, 1970, at 00:00:00 Coordinated Universal Time (UTC)).
    // Example value of a unix timestamp: 1629780000 for date 2021-08-24 12:00:00

    // So we dont have control over the value, type or format of the timestamp
    // it will always be a unix timestamp of type <number>.
    // Your app , when retreiving the timestamp from the database, can convert
    // the unix timestamp to a Date object using the Date constructor.

    const newData = {
      ...data,
      timestamp: serverTimestamp(), // Value is object { '.sv': 'timestamp' }
    };

    return newData as T & { timestamp: object };
  }
}
