import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FieldPacket, ResultSetHeader } from 'mysql2';
import { AppService } from './app.service';
import db from './db';
import TarhelyDto from './tarhely.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/tarhely')
  async findAll() {
    const [tarhelyek] = await db.execute(`
    SELECT *
    FROM tarhelycsomagok
    `);

    return tarhelyek;
  }

  @Get('/api/tarhely/:id')
  async findOne(@Param('id') id: number) {
    const [result] = await db.execute(`
    SELECT *
    FROM tarhelycsomagok
    WHERE id=${id}
    `);

    return result[0];
  }

  @Put('/api/tarhely/:id')
  async updateOne(@Param('id') id: number, @Body() tarhely: TarhelyDto) {
    await db.execute(`
    UPDATE tarhelycsomagok SET
    nev = '${tarhely.nev}',
    meret = '${tarhely.meret}',
    ar = '${tarhely.ar}'
    WHERE tarhelycsomagok.id = ${id};
    `);

    const [updatedTarhely] = await db.execute(`
    SELECT *
    FROM tarhelycsomagok
    WHERE id = ${id}
    `);

    return updatedTarhely[0];
  }

  @Post('/api/tarhely')
  async create(@Body() tarhely: TarhelyDto) {
    const result: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `INSERT INTO tarhelycsomagok (nev, meret, ar) VALUES (
        '${tarhely.nev}',
        '${tarhely.meret}',
        '${tarhely.ar}'
        )
        `,
    );

    const newTarhelyId = result[0].insertId;
    const [newTarhely] = await db.execute(`
    SELECT *
    FROM tarhelycsomagok
    WHERE id = ${newTarhelyId}
    `);

    return newTarhely[0];
  }

  @Delete('/api/tarhely/:id')
  async deleteCat(@Param('id') id: number) {
    await db.execute(`
    DELETE FROM tarhelycsomagok
    WHERE id = ${id};
    `);
  }
}
