import { 
  Controller, 
  Post, 
  Body, 
  ValidationPipe 
} from '@nestjs/common';
import { PasswordResetService } from '../services/password-reset.service';
import { 
  RequestPasswordResetDto, 
  ResetPasswordDto 
} from '../dto/password-reset.dto';

@Controller('auth/password')
export class PasswordResetController {
  constructor(
    private passwordResetService: PasswordResetService
  ) {}

  @Post('request-reset')
  async requestPasswordReset(
    @Body(new ValidationPipe()) 
    requestDto: RequestPasswordResetDto
  ) {
    return this.passwordResetService.requestPasswordReset(requestDto);
  }

  @Post('reset')
  async resetPassword(
    @Body(new ValidationPipe()) 
    resetDto: ResetPasswordDto
  ) {
    return this.passwordResetService.resetPassword(resetDto);
  }
}
