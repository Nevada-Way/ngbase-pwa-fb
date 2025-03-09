import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { MyAppDataService } from './services/my-app-data.service';
import { MyAppLogModel } from './models/log.model';
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

  constructor(private myAppDataService: MyAppDataService) {
    //////////////////////
    this.myAppDataService.addNewLogEntry(
      'test-mar-07',
      2,
      'This is a test message'
    );

    //////////////////
    const logItem: Promise<MyAppLogModel | null> =
      this.myAppDataService.getLogItemById(this.targetDocId);
    console.log('Log item object is : ', logItem);

    //////////////////
    this.myAppDataService.updateLogItem(this.targetDocId, {
      logMessage: 'New message',
    });

    ////////////////
    this.myAppDataService.deleteLogItem(this.deleteTargetPath);
  }
}
