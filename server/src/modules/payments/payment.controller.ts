import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtService } from '@nestjs/jwt';

@Controller('/payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly jwtService: JwtService
  ) {}

  @Post('/zalopay')
  @HttpCode(200)
  async zalopayController(
    @Body() data: any,
    @Headers('Authorization') header: string
  ): Promise<any> {
    const token = header.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Not found token');
    }
    console.log(token);

    const payloadToken = this.jwtService.decode(token);
    return await this.paymentService.zalopayService(data, payloadToken.user_id);
  }

  @Post('/callback')
  @HttpCode(200)
  async zalopayCallbackController(@Body() data: any): Promise<any> {
    return await this.paymentService.zalopayCallbackService(data);
  }

  @Post('/check-status/:app_trans_id')
  @HttpCode(200)
  async zalopayCheckStatusController(
    @Param() app_trans_id: string
  ): Promise<any> {
    return await this.paymentService.zalopayCheckStatusService(app_trans_id);
  }
}
