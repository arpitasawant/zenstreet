import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException('Invalid data');
    }
    return value;
  }
}
