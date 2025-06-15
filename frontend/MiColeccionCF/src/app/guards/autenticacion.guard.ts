//Guard para proteger las rutas de la aplicación
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AutenticacionService } from '../services/autenticacion.service';

export const autenticacionGuard: CanActivateFn = () => {
  const router = inject(Router);
  const autenticacionService = inject(AutenticacionService);

  return autenticacionService.check().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
