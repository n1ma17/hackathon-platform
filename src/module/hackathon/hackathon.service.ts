import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../lib/database/prisma.service.js';
import { CreateHackathonDto } from './dto/create-hackathon.dto.js';
import { UpdateHackathonDto } from './dto/update-hackathon.dto.js';

const hackathonSelect = {
  id: true,
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  isActive: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.HackathonSelect;

export type HackathonResponse = Prisma.HackathonGetPayload<{
  select: typeof hackathonSelect;
}>;

const hackathonParticipantSelect = {
  id: true,
  hackathonId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.HackathonParticipantSelect;

export type HackathonParticipantResponse = Prisma.HackathonParticipantGetPayload<{
  select: typeof hackathonParticipantSelect;
}>;

@Injectable()
export class HackathonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createHackathonDto: CreateHackathonDto,
    authorId: string,
  ): Promise<HackathonResponse> {
    return this.prisma.hackathon.create({
      data: {
        name: createHackathonDto.name,
        description: createHackathonDto.description,
        startDate: createHackathonDto.startAt,
        endDate: createHackathonDto.endAt,
        isActive: createHackathonDto.isActive ?? true,
        authorId,
      },
      select: hackathonSelect,
    });
  }

  async findAll(): Promise<HackathonResponse[]> {
    return this.prisma.hackathon.findMany({
      select: hackathonSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<HackathonResponse> {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id },
      select: hackathonSelect,
    });

    if (!hackathon) {
      throw new NotFoundException(`Hackathon with id "${id}" not found`);
    }

    return hackathon;
  }

  async update(
    id: string,
    updateHackathonDto: UpdateHackathonDto,
  ): Promise<HackathonResponse> {
    await this.findOne(id);

    const data: Prisma.HackathonUpdateInput = {};

    if (updateHackathonDto.name !== undefined) {
      data.name = updateHackathonDto.name;
    }
    if (updateHackathonDto.description !== undefined) {
      data.description = updateHackathonDto.description;
    }
    if (updateHackathonDto.startAt !== undefined) {
      data.startDate = updateHackathonDto.startAt;
    }
    if (updateHackathonDto.endAt !== undefined) {
      data.endDate = updateHackathonDto.endAt;
    }
    if (updateHackathonDto.isActive !== undefined) {
      data.isActive = updateHackathonDto.isActive;
    }

    return this.prisma.hackathon.update({
      where: { id },
      data,
      select: hackathonSelect,
    });
  }

  async remove(id: string): Promise<HackathonResponse> {
    await this.findOne(id);

    return this.prisma.hackathon.delete({
      where: { id },
      select: hackathonSelect,
    });
  }

  async join(
    hackathonId: string,
    userId: string,
  ): Promise<HackathonParticipantResponse> {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id: hackathonId },
      select: { id: true, isActive: true, endDate: true },
    });

    if (!hackathon) {
      throw new NotFoundException(
        `Hackathon with id "${hackathonId}" not found`,
      );
    }

    if (!hackathon.isActive) {
      throw new BadRequestException('Hackathon is not active');
    }

    if (hackathon.endDate.getTime() <= Date.now()) {
      throw new BadRequestException('Hackathon has already ended');
    }

    try {
      return await this.prisma.hackathonParticipant.create({
        data: {
          hackathonId,
          userId,
        },
        select: hackathonParticipantSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'You have already joined this hackathon',
        );
      }
      throw error;
    }
  }
}
