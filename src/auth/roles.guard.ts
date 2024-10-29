import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Không yêu cầu quyền hạn => Cho phép truy cập
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(user)
    console.log(requiredRoles)
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
