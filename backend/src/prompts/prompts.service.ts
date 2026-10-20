import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Prompt, PromptDocument } from './prompt.schema';

@Injectable()
export class PromptsService {
  constructor(
    @InjectModel(Prompt.name) private promptModel: Model<PromptDocument>,
  ) {}

  // 1. Méthode pour poser une question à l'IA et sauvegarder le prompt
  async ask(userId: string, question: string) {
    // 1. On enregistre la question et l'utilisateur
    await this.promptModel.create({
      user: new Types.ObjectId(userId),
      question,
    });

    // 2. On interroge l'IA (la réponse n'est pas stockée)
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY as string,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }],
        }),
      });

      const data: any = await res.json();
      if (!res.ok) {
        console.error('Erreur IA :', JSON.stringify(data));
        throw new Error(data?.error?.message || 'Erreur API');
      }

      const answer = (data.candidates?.[0]?.content?.parts ?? [])
        .map((p: any) => p.text ?? '')
        .join('');

      return { answer: answer || "L'IA n'a pas renvoyé de réponse." };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("L'IA n'a pas pu répondre");
    }
  }

  // 2. Méthode pour récupérer l'historique de l'utilisateur
  async history(userId: string) {
    return this.promptModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(100)
      .select('question createdAt')
      .lean();
  }
}