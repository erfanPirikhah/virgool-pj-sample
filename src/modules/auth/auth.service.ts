import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { OTPEntity } from "../user/entities/otp.entity";
import { CheckOtpDto, SendOtpDto } from "./dto/auth.dto";
import { randomInt } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./types/payload";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(OTPEntity)
    private otpRepository: Repository<OTPEntity>,

    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async sendOTP(otpDto: SendOtpDto) {
    const { mobile } = otpDto;
    let user = await this.userRepository.findOneBy({ mobile });

    if (!user) {
      user = this.userRepository.create({ mobile });
      user = await this.userRepository.save(user);
    }

    await this.createOtpForUser(user);
    return {
      message: "send code successfully",
    };
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;
    const now = new Date();
    const user = await this.userRepository.findOne({
      where: { mobile },
      relations: { otp: true },
    });

    if (!user || !user?.otp)
      throw new UnauthorizedException("not found this account");
    if (user?.otp?.code !== code)
      throw new UnauthorizedException("this password is incorrect");
    if (user?.otp.expire_in < now)
      throw new UnauthorizedException("otp was expired");
    if (user.mobile_verify == false) {
      await this.userRepository.update(
        { id: user.id },
        { mobile_verify: true }
      );
    }

    const {refreshToken,accessToken} = this.makeTokenOfUser({id:user.id,mobile})
    return {
      refreshToken,
      accessToken,
      message: "you are login successfully",
    };
  }
  async createOtpForUser(user: UserEntity) {
    const code = randomInt(10000, 99999).toString();
    const expire_in = new Date(new Date().getTime() + 1000 * 60 * 2);

    let otp = await this.otpRepository.findOneBy({ userId: user.id });

    if (otp) {
      if (otp.expire_in > new Date())
        throw new BadRequestException("otp code not expired .");
      otp.expire_in = expire_in;
      otp.code = code;
    } else {
      otp = this.otpRepository.create({
        code,
        expire_in,
        userId: user.id,
      });
    }

    await this.otpRepository.save(otp);
    user.otpId = otp.id;
    user = await this.userRepository.save(user);
  }


  makeTokenOfUser(payload:TokenPayload){
    
    console.log(this.configService.get("Jwt.accessToken"));
    
    const refreshToken = this.jwtService.sign(
      { id: payload.id, mobile:payload.mobile },
      {
        secret: this.configService.get("Jwt.refreshToken"),
        expiresIn: "30d",
      }
    );

    const accessToken = this.jwtService.sign(
      { id: payload.id, mobile:payload.mobile },
      {
        secret: this.configService.get("Jwt.accessToken"),
        expiresIn: "30y",
      }
      );
      return { accessToken,refreshToken}
  }

}
