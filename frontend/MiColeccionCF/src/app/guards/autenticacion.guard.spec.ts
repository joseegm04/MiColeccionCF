import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { autenticacionGuard } from './autenticacion.guard';
import { AutenticacionService } from '../services/autenticacion.service';
import { isObservable, of, throwError } from 'rxjs';

describe('autenticacionGuard', () => {
  let mockAutenticacionService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAutenticacionService = {
      check: jasmine.createSpy('check')
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AutenticacionService, useValue: mockAutenticacionService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('debe permitir el acceso si el usuario está autenticado', (done) => {
    mockAutenticacionService.check.and.returnValue(of({}));
    TestBed.runInInjectionContext(() => {
      const result = autenticacionGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      if (isObservable(result)) {
        result.subscribe(res => {
          expect(res).toBeTrue();
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });
  });

  it('debe redirigir a /login y denegar acceso si el usuario no está autenticado', (done) => {
    mockAutenticacionService.check.and.returnValue(throwError(() => new Error('No auth')));
    TestBed.runInInjectionContext(() => {
      const result = autenticacionGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      if (isObservable(result)) {
        result.subscribe(res => {
          expect(res).toBeFalse();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
          done();
        });
      } else {
        expect(result).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }
    });
  });

  it('debe llamar a autenticacionService.check()', () => {
    mockAutenticacionService.check.and.returnValue(of({}));
    TestBed.runInInjectionContext(() => {
      const result = autenticacionGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      if (isObservable(result)) {
        result.subscribe(() => {
          expect(mockAutenticacionService.check).toHaveBeenCalled();
        });
      } else {
        expect(mockAutenticacionService.check).toHaveBeenCalled();
      }
    });
  });
});
