// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you have a PrismaService
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const { id, email, password, phone } = registerDto;

    // Check if user already exists by email or phone
    const existingUserByEmail = await this.prisma.users.findFirst({
      where: { email },
    });

    const existingUserByPhone = phone
      ? await this.prisma.users.findUnique({
          where: { phone },
        })
      : null;

    if (existingUserByEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    if (existingUserByPhone) {
      throw new BadRequestException(
        'User with this phone number already exists',
      );
    }

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await this.prisma.users.create({
      data: {
        id,
        email,
        encrypted_password: hashedPassword, // Explicitly typed as string
        phone: phone ?? null, // Handle nullable phone field
        created_at: new Date(),
        updated_at: new Date(),
        // Provide default values for other required fields if necessary
        is_sso_user: false, // Required field with a default value in the schema
        is_anonymous: false, // Required field with a default value in the schema
      },
    });

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      created_at: user.created_at,
    };
  }

  // Login a user
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find the user by email
    const user = await this.prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.encrypted_password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const session = await this.prisma.sessions.create({
      data: {
        id: crypto.randomUUID(),
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
      },
      sessionId: session.id,
    };
  }

  // Get user details by ID
  async getUserById(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
