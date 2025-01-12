import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';


@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') requiredRoles: string[] = []; // Accept roles as input

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const hasAccess = this.authService.hasRole(this.requiredRoles);

    if (hasAccess) {
      // If user has the required roles, display the element
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Otherwise, clear the element
      this.viewContainer.clear();
    }
  }
}
