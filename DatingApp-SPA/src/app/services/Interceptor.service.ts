import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class Interceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    _next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return _next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          const applicationError = error.headers.get("Application-Error");
          if (applicationError) {
            return throwError(applicationError);
          }
          const serverError = error.error;
          let modalStateError = "";
          if (serverError && typeof serverError === "object") {
            for (const key in serverError) {
              if (serverError[key]) {
                modalStateError += serverError[key] + "\n";
              }
            }
          }
          return throwError(modalStateError || serverError || "Server Error");
        }
      })
    );
  }
}
export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: Interceptor,
  multi: true
};
