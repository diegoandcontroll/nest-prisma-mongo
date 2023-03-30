import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}
  async create(input: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        body: input.body,
        slug: input.slug,
        title: input.title,
        authorId: input.authorId ? input.authorId : null,
      },
    });
    return post;
  }

  async findAll() {
    const post = await this.prisma.post.findMany({
      include: {
        author: true,
        comments: true,
      },
    });
    return post.map((item) => {
      delete item.author.password;
      return item;
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findFirst({
      include: {
        author: true,
        comments: true,
      },
      where: { id },
    });
    if (!post) {
      throw new HttpException('NOT FOUND POST', HttpStatus.NOT_FOUND);
    }
    delete post.author.password;
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    if (!post) {
      throw new HttpException('NOT FOUND POST', HttpStatus.NOT_FOUND);
    }
    await this.prisma.post.update({
      where: { id },
      data: {
        title: updatePostDto.title,
        body: updatePostDto.body,
      },
    });
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    if (!post) {
      throw new HttpException('NOT FOUND POST', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.post.delete({
      where: { id },
    });
  }
}
