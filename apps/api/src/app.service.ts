import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { status: string; message: string; version: string } {
    return {
      status: 'ok',
      message: 'LEX Platform API is running smoothly.',
      version: '1.0.0',
    };
  }
}
