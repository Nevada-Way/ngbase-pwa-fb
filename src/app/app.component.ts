import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// TODO - VERIFY THAT UPDATE FEATURE WORKS import { SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LogEntriesService } from './services/log-entries.service';
import { MyAppLogModel } from './models/log.model';
import { UserInfoModel } from './models/user.model';
import { UserDbService } from './services/user-db.service';
import { SwUpdate } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngbase-pwa-fb';
  environment1 = environment.currentBuildVersion;

  constructor(
    private logEntriesService: LogEntriesService,
    private userDbService: UserDbService,
    private swUpdate: SwUpdate
  ) {
    // Testing the Firestore services
    // this.testFirestoreService();

    //////////////////////
    // Testing the Firebase Real Time DB services
    this.testRealTimeDbService();
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event) => {
        if (
          event.type === 'VERSION_READY' &&
          confirm('New version available. Do you want to load it ?')
        ) {
          this.swUpdate.activateUpdate().then(() => window.location.reload());
        }
      });
    }
  }

  /**
   * This method is used to concentrate testing scenarios of the Real Time DB services
   * In this current version the method test:
   * (1) Create a new user
   *
   * Backlog:
   * (1) Read a specific value from a user object property
   * (2) Read a list of user objects
   * (3) Update a specific property of a user object
   * (4) Delete a user
   * @returns void
   */
  testRealTimeDbService() {
    ////////////////////////////////////////////////////////
    // This section we set values for constants used in the test
    ////////////////////////////////////////////////////////

    // The appGeneratedUserId is used here as placheholder for
    // a future option to have the app generate the userId.
    const appGeneratedUserId = 'app-user-id-1';
    const fakeFirstName = 'first-name-1';
    const fakeUserLevel = 45;

    ////////////////////////////////////////////////////////
    // This section calls the create user method
    // we set the user object then toggle options
    // to append timestamp and use the Firebase auto gen ID
    ////////////////////////////////////////////////////////

    this.userDbService.createNewUser(
      {
        userId: appGeneratedUserId,
        userFirstName: fakeFirstName,
        userLevel: fakeUserLevel,
      },
      true, // Append timestamp to data object
      true // Use FB auto gen ID
    );
  }

  /**
   * Test Firestore service CRUD operations
   * The current version tests these features:
   * (1) CREATE Add new log entry
   * (2) READ read value of existing entry
   * (3) UPDATE a value of existing entry
   * (4) DELETE an existing entry
   * Backlog: 
   * (1) Fetch a list of docs from a collection by max amount

  // //////////////////////
   * @returns void
   */
  testFirestoreService() {
    //////////////////////
    // Define specific values for Firestor testing
    // use the Firebase console to play with values
    //////////////////////
    const targetDocId = 'test-mar-07/LTepvrppR60YUEnEc1f2';
    const deleteTargetPath = 'test-mar-07/qWGQaeud2YyITywsJG75';

    //////////////////////
    // CREATE Add new log entry
    //////////////////////
    this.logEntriesService.addNewLogEntry(
      'test-mar-18',
      2,
      'This is a test message'
    );

    //////////////////////
    // READ read value of existing entry
    //////////////////////
    const logItem: Promise<MyAppLogModel | null> =
      this.logEntriesService.getLogItemById(targetDocId);
    console.log('Log item object is : ', logItem);

    //////////////////////
    // UPDATE a value of existing entry
    //////////////////////
    this.logEntriesService.updateLogItem(targetDocId, {
      logMessage: 'New message',
    });

    //////////////////////
    // DELETE an existing entry
    //////////////////////
    this.logEntriesService.deleteLogItem(deleteTargetPath);
  }
}
