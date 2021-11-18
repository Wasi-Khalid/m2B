import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSoldComponent } from './item-sold.component';

describe('ItemSoldComponent', () => {
  let component: ItemSoldComponent;
  let fixture: ComponentFixture<ItemSoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
