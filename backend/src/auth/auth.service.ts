import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/user.schema';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (exists) throw new ConflictException('Cet email est déjà utilisé');

    const hash = await bcrypt.hash(dto.motDePasse, 10);
    const user = await this.userModel.create({ ...dto, motDePasse: hash });
    return this.buildResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const ok = await bcrypt.compare(dto.motDePasse, user.motDePasse);
    if (!ok) throw new UnauthorizedException('Email ou mot de passe incorrect');

    return this.buildResponse(user);
  }

  private buildResponse(user: UserDocument) {
    const token = this.jwt.sign({ sub: user._id.toString(), email: user.email });
    return {
      token,
      user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email },
    };
  }
}