import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SettingsTeamComponent } from 'src/app/components/settings-team/settings-team.component';
import { SettingsListComponent } from 'src/app/components/settings-list/settings-list.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MatCardModule, SettingsTeamComponent, SettingsListComponent]
})
export class SettingsPage implements OnInit {

  settingsOpen = {
    teams: false
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onGoToSettings() {
    this.settingsOpen.teams = false;
  }

  onItemClick(route: string) {
    if(route === 'teams') {
      this.settingsOpen.teams = true;
    }
  }

}
