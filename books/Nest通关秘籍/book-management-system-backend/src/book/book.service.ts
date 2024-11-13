import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

function randomNum() {
  return Math.floor(Math.random() * 1000000);
}

@Injectable()
export class BookService {
  @Inject(DbService)
  dbService: DbService;

  async list() {
    const books: Book[] = await this.dbService.read();
    return books;
  }

  async findById(id: number) {
    const books: Book[] = await this.dbService.read();
    return books.find((item) => item.id === id);
  }

  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.dbService.read();

    const book = new Book();
    book.id = randomNum();
    book.author = createBookDto.author;
    book.name = createBookDto.name;
    book.description = createBookDto.description;
    book.cover = createBookDto.cover;

    books.push(book);
    await this.dbService.write(books);
    return book;
  }

  async update(updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.dbService.read();

    const targetBook = books.find((book) => book.id === updateBookDto.id);

    if (!targetBook) {
      throw new BadRequestException('没有找到对应的书籍');
    }

    targetBook.title = updateBookDto.author;
    targetBook.cover = updateBookDto.cover;
    targetBook.description = updateBookDto.description;
    targetBook.name = updateBookDto.name;

    await this.dbService.write(books);
    return targetBook;
  }

  async delete(id: number) {
    const books: Book[] = await this.dbService.read();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
      books.splice(index, 1);
      await this.dbService.write(books);
    }
  }
}
