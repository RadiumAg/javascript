import { Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

function randomNum() {
  return Math.floor(Math.random() * 1000000);
}

@Injectable()
export class BookService {
  @Inject()
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
  }

  delete(id: number) {}
}
