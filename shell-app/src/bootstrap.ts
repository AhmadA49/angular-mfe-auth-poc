import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { initFederation } from '@angular-architects/module-federation';

initFederation('/assets/mf.manifest.json')
  .catch((err) => console.error('Federation init error:', err))
  .then(() => bootstrapApplication(AppComponent, appConfig))
  .catch((err) => console.error('Bootstrap error:', err));
