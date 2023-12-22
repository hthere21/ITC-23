import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecommendationComponent } from './user-recommendation.component';

describe('UserRecommendationComponent', () => {
  let component: UserRecommendationComponent;
  let fixture: ComponentFixture<UserRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRecommendationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
