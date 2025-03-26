// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @ApiProperty({
    description: 'The id of the user',
    example: '1',
  })
  id: any;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'The password of the user (minimum 6 characters)',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'The phone number of the user (optional)',
    example: '1234567890',
    required: false, // Indicate that this field is optional
  })
  @IsOptional()
  phone?: string;
}