import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if(!request.headers.authorization) {
      throw new UnauthorizedException('비정상적인 토큰입니다.');
    }
    const token = this.authService.extractJwtToken(request.headers.authorization);
    this.authService.verifyToken(token);

    return true;
  }
}