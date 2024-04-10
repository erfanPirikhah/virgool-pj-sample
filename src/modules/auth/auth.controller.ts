import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckOtpDto, SendOtpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-otp')
  sendOtp(@Body() otpDto:SendOtpDto){
    return this.authService.sendOTP(otpDto)
  }

  @Post('/check-otp')
  checkOtp(@Body() checkOtpDto : CheckOtpDto){
    return this.authService.checkOtp(checkOtpDto)
  }
}
