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

  testRealTimeDbService() {
    //////////////////////
    // Define specific values for Firestor testing
    // use the Firebase console to play with values
    //////////////////////
    const fakeUserId_1 = 'user-id-1';
    const fakeUserId_2 = 'user-id-2';
    const fakeFirstName_1 = 'first-name-1';
    const fakeFirstName_2 = 'first-name-2';
    const initialLevel = 1;

    //////////////////////
    this.userDbService.createNewUser({
      userId: fakeUserId_1,
      userFirstName: fakeFirstName_1,
      userLevel: initialLevel,
    });

    this.userDbService.createNewUser({
      userId: fakeUserId_2,
      userFirstName: fakeFirstName_2,
      userLevel: initialLevel + 1,
    });
  }

  /**
   * Test Firestore service CRUD operations
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

  //////////////////////
  // TODO
  // More things to test
  // (1) Fetch a list of docs from a collection by max amount
  // //////////////////////
}
