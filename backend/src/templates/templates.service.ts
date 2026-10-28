import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/user.schema.js';
import { CreateTemplateDto } from './templates.dto.js';
import { Template, TemplateDocument } from './templates.schema.js';
import { SEED } from './templates.seed.js';

@Injectable()
export class TemplatesService implements OnModuleInit {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Au démarrage : ajoute les exemples si la collection est vide
  async onModuleInit() {
    if ((await this.templateModel.countDocuments()) > 0) return;
    await this.templateModel.insertMany(SEED);
  }

  // Transforme un document en objet adapté au frontend
  private format(t: any, userId: string) {
    const has = (list: Types.ObjectId[]) => list.some((x) => x.toString() === userId);
    return {
      id: t._id,
      titre: t.titre,
      description: t.description,
      contenu: t.contenu,
      categorie: t.categorie,
      auteurNom: t.auteurNom,
      likesCount: t.likesCount,
      liked: has(t.likedBy),
      saved: has(t.savedBy),
    };
  }

  async list(userId: string, search?: string, categorie?: string) {
    const filter: any = {};
    if (categorie) filter.categorie = categorie;
    if (search?.trim()) {
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // échappe les caractères spéciaux
      const regex = new RegExp(safe, 'i'); // 'i' : insensible à la casse
      filter.$or = [{ titre: regex }, { description: regex }, { contenu: regex }];
    }
    const items = await this.templateModel.find(filter).sort({ likesCount: -1, createdAt: -1 }).lean();
    return items.map((t) => this.format(t, userId));
  }

  async mine(userId: string) {
    const uid = new Types.ObjectId(userId);
    const items = await this.templateModel
      .find({ $or: [{ savedBy: uid }, { auteur: uid }] })
      .sort({ createdAt: -1 })
      .lean();
    return items.map((t) => this.format(t, userId));
  }

  async create(userId: string, dto: CreateTemplateDto) {
    const uid = new Types.ObjectId(userId);
    const user = await this.userModel.findById(uid);
    const created = await this.templateModel.create({
      ...dto,
      auteur: uid,
      auteurNom: user ? `${user.prenom} ${user.nom.charAt(0)}.` : 'Anonyme',
      savedBy: [uid], // un prompt créé est automatiquement dans "Mes prompts"
    });
    return this.format(created.toObject(), userId);
  }

  like(userId: string, id: string) {
    return this.toggle(userId, id, 'likedBy');
  }

  save(userId: string, id: string) {
    return this.toggle(userId, id, 'savedBy');
  }

  // Ajoute l'utilisateur à la liste s'il n'y est pas, le retire sinon
  private async toggle(userId: string, id: string, field: 'likedBy' | 'savedBy') {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Prompt introuvable');
    const t = await this.templateModel.findById(id).lean();
    if (!t) throw new NotFoundException('Prompt introuvable');

    const uid = new Types.ObjectId(userId);
    const has = t[field].some((x) => x.toString() === userId);
    const update: any = has ? { $pull: { [field]: uid } } : { $addToSet: { [field]: uid } };
    if (field === 'likedBy') update.$inc = { likesCount: has ? -1 : 1 };

    await this.templateModel.updateOne({ _id: id }, update);
    const fresh = await this.templateModel.findById(id).lean();
    return this.format(fresh, userId);
  }
}