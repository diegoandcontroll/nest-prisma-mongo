export class CreatePostDto {
  slug: string;
  title: string;
  body: string;
  authorId?: string;
}
