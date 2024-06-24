import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OpportunityChildrenComponent } from './opportunity-children.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OpportunityService } from 'src/app/services/opportunity.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { IOpportunityChildrenResponse, IOpportunityWithParentName } from 'src/app/interfaces/iopportunity-children-response';

describe('OpportunityChildrenComponent', () => {
  let component: OpportunityChildrenComponent;
  let fixture: ComponentFixture<OpportunityChildrenComponent>;
  let response: IOpportunityChildrenResponse

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [
        HttpClientTestingModule,
        ProgressSpinnerModule,
        FormsModule,
        TableModule,
        ToastModule
      ],
      declarations: [OpportunityChildrenComponent],
      providers: [OpportunityService, MessageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    response = {opportunities:[]} as IOpportunityChildrenResponse
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn<any>(component, 'getChildren');
    expect(component.loading).toBeTrue();
    expect(component.deleting).toBeFalse();
    expect(component.opportunities).toEqual([]);
    component.ngOnInit();
    expect(component['getChildren']).toHaveBeenCalled();
  })

  it('should get children', () => {
    spyOn<any>(component['oppService'], 'getChildren').and.returnValue(new Observable(subscriber => {
      expect(component.loading).toBeTrue();
      subscriber.next(response);
    }));
  
    component['getChildren']();

    expect(component['oppService'].getChildren).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.opportunities).toEqual(response.opportunities);
  })

  it('should remove child', () => {
    component.opportunities = response.opportunities
    spyOn<any>(component['oppService'], 'removeChildFromParent').and.returnValue(new Observable(subscriber => {
      expect(component.deleting).toBeTrue();
      subscriber.next(response);
    }));
  
    spyOn(component['messageService'], 'add');
    component['removeChild'](1);

    expect(component['messageService'].add).toHaveBeenCalledOnceWith({ severity: 'success', summary: 'Success', detail: 'Child removed.' });
    expect(component.deleting).toBeFalse();
  })
});
