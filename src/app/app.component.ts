import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngbase-pwa-fb';

  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event) => {
        if (
          event.type === 'VERSION_READY' &&
          confirm('Ne version available. Do you want to load it ?')
        ) {
          this.swUpdate.activateUpdate().then(() => window.location.reload());
        }
      });
    }
  }
}
