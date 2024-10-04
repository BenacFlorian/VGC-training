import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'comp-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss'],
  standalone: true,
  imports: [MatListModule]
})
export class SettingsListComponent implements OnInit {
  @Output() itemClicked = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  onItemClick(route: string) {
    this.itemClicked.emit(route);
  }
}
