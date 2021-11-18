import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatProductsComponent } from './cat-products.component';

describe('CatProductsComponent', () => {
  let component: CatProductsComponent;
  let fixture: ComponentFixture<CatProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
