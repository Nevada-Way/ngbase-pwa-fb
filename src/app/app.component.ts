import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// TODO - VERIFY THAT UPDATE FEATURE WORKS import { SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LogEntriesService } from './services/log-entries.service';
import { MyAppLogModel } from './models/log.model';
import { UserInfoModel } from './models/user.model';
import { UserDbService } from './services/user-db.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngbase-pwa-fb';
  environment1 = environment.currentBuildVersion;
  targetDocId = 'test-mar-07/LTepvrppR60YUEnEc1f2';
  deleteTargetPath = 'test-mar-07/qWGQaeud2YyITywsJG75';

  constructor(
    private logEntriesService: LogEntriesService,
    private userDbService: UserDbService
  ) {
    // //////////////////////
    // this.logEntriesService.addNewLogEntry(
    //   'test-mar-18',
    //   2,
    //   'This is a test message'
    // );

    // //////////////////
    // const logItem: Promise<MyAppLogModel | null> =
    //   this.logEntriesService.getLogItemById(this.targetDocId);
    // console.log('Log item object is : ', logItem);

    // //////////////////
    // this.logEntriesService.updateLogItem(this.targetDocId, {
    //   logMessage: 'New message',
    // });

    // ////////////////
    // this.logEntriesService.deleteLogItem(this.deleteTargetPath);

    //////////=================///////////
    // Now starting FB Real Time DB interactions
    /////////////////////////////////////////

    //////////////////////
    this.userDbService.createNewUser({
      userId: '3e3e3',
      userFirstName: 'Felix',
      userLevel: 2,
    });

    this.userDbService.createNewUser({
      userId: '3e3e3_2',
      userFirstName: 'Felix2',
      userLevel: 3,
    });
  }
}
