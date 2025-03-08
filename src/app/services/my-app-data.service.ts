import { Injectable } from '@angular/core';
import { MyAppLogModel } from '../models/log.model';
import { FirestoreService } from './firestore.service';
import { Firestore } from '@angular/fire/firestore';

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

  public async getBudgetData(): Promise<MyAppLogModel | null> {
    try {
      const budgetData =
        /*We use 'this' because this class 'DataAccessService' extends FirestoreService */
        await this.getDocument<MyAppLogModel>(
          'budget/ni3RFtRqRuRWalX3gVBQ' // 'cu0mTrel1L44YumvywFA'
        );
      console.log('getBudgetData() is returning this :', budgetData);
      return budgetData;
    } catch (error) {
      console.error('Error fetching budget data:', error);
      return null; // Return null to indicate failure
    }
  }

  public async updateBudgetData(data: Partial<MyAppLogModel>): Promise<void> {
    try {
      await this.updateDocument<MyAppLogModel>(
        'budget/ni3RFtRqRuRWalX3gVBQ', // 'cu0mTrel1L44YumvywFA',
        data
      );
      console.log('updateBudgetData() updated successfully : ', data);
    } catch (error) {
      console.error('Error updating budget data:', error);
      throw error; // Re-throw the error to be handled by the caller if needed
    }
  }

  public async logTheExpenseEntry(
    budgetBeforeExpense: number,
    expense: number
  ): Promise<string> {
    const result: Promise<string> = this.createDocument({
      preExpenseBudget: budgetBeforeExpense,
      expenseEntered: expense,
    });
    return result;
  }
}
