// src/auth/auth.controller.ts
import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { LoginDto, RegisterDto } from './dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
  
  @ApiTags('auth')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true })) // Validate incoming DTO
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User registered successfully',
      schema: {
        example: {
          status: 'success',
          message: 'User registered successfully',
          data: {
            id: 'uuid-string',
            email: 'user@example.com',
            phone: '1234567890',
            created_at: '2025-03-26T12:00:00.000Z',
          },
        },
      },
    })
    @ApiBadRequestResponse({
      description: 'User with this email or phone number already exists',
      schema: {
        example: {
          statusCode: 400,
          message: 'User with this email already exists',
          error: 'Bad Request',
        },
      },
    })
    async register(@Body() registerDto: RegisterDto) {
      const user = await this.authService.register(registerDto);
      return {
        status: 'success',
        message: 'User registered successfully',
        data: user,
      };
    }
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true })) // Validate incoming DTO
    @ApiOperation({ summary: 'Log in a user' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Login successful',
      schema: {
        example: {
          status: 'success',
          message: 'Login successful',
          data: {
            user: {
              id: 'uuid-string',
              email: 'user@example.com',
              phone: '1234567890',
            },
            sessionId: 'uuid-string',
          },
        },
      },
    })
    @ApiUnauthorizedResponse({
      description: 'Invalid email or password',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid email or password',
          error: 'Unauthorized',
        },
      },
    })
    async login(@Body() loginDto: LoginDto) {
      const result = await this.authService.login(loginDto);
      return {
        status: 'success',
        message: 'Login successful',
        data: result,
      };
    }
  
    @Get('user/:id')
    @ApiOperation({ summary: 'Get user details by ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'User retrieved successfully',
      schema: {
        example: {
          status: 'success',
          message: 'User retrieved successfully',
          data: {
            id: 'uuid-string',
            email: 'user@example.com',
            phone: '1234567890',
            created_at: '2025-03-26T12:00:00.000Z',
            updated_at: '2025-03-26T12:00:00.000Z',
          },
        },
      },
    })
    @ApiBadRequestResponse({
      description: 'User not found',
      schema: {
        example: {
          statusCode: 400,
          message: 'User not found',
          error: 'Bad Request',
        },
      },
    })
    async getUser(@Param('id') userId: string) {
      const user = await this.authService.getUserById(userId);
      return {
        status: 'success',
        message: 'User retrieved successfully',
        data: user,
      };
    }
  }