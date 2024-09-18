import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbilitiesQuizPage } from './abilities-quiz.page';

describe('AbilitiesQuizPage', () => {
  let component: AbilitiesQuizPage;
  let fixture: ComponentFixture<AbilitiesQuizPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilitiesQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
