import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Orders MFE Root Component
 * 
 * When loaded by the Shell, this component is not used directly.
 * The Shell loads the routes which render OrderListComponent or OrderDetailComponent.
 * This component is for standalone development/testing of the MFE.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="mfe-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .mfe-container {
      padding: 20px;
    }
  `]
})
export class AppComponent {
  title = 'Orders MFE';
}
