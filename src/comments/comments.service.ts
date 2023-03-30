import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        comment: createCommentDto.comment,
        postId: createCommentDto.postId ? createCommentDto.postId : null,
      },
    });
    return comment;
  }

  async findAll() {
    const comments = await this.prisma.comment.findMany({
      include: {
        post: true,
      },
    });
    return comments;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findFirst({
      where: { id },
    });

    if (!comment) {
      throw new HttpException('NOT FOUND COMMENT', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.comment.update({
      where: { id },
      data: {
        comment: updateCommentDto.comment,
      },
    });
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id },
    });

    if (!comment) {
      throw new HttpException('NOT FOUND COMMENT', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.comment.delete({
      where: { id },
    });
  }
}
