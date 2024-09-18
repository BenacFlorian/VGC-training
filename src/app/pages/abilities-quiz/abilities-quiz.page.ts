import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AbilitiesQuizComponent } from 'src/app/components/abilities-quiz/abilities-quiz.component';

@Component({
  selector: 'app-abilities-quiz',
  templateUrl: './abilities-quiz.page.html',
  styleUrls: ['./abilities-quiz.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AbilitiesQuizComponent]
})
export class AbilitiesQuizPage implements OnInit {

  isQuestionCreated = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }
  backToMenu(){
    this.router.navigateByUrl('/training-menu');
  }

}
