import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { MyAppDataService } from './services/my-app-data.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngbase-pwa-fb';
  environment1 = environment.currentBuildVersion;

  constructor(private myAppDataService: MyAppDataService) {
    this.myAppDataService.addNewLogEntry(
      'lala',
      2,
      'This is a test message',
      true // True to add a timestamp
    );
  }
}
