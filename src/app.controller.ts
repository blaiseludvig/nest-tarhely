import { Body, Controller, Delete, Get, Param, Post, Render } from '@nestjs/common';
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

    return { tarhelyek: tarhelyek };
  }

  @Post('/api/tarhely')
  async create(@Body() tarhely: TarhelyDto) {
    const result: [ResultSetHeader, FieldPacket[]] = await db.execute(`
    INSERT INTO tarhelycsomagok (nev, meret, ar)
    VALUES (
    "${tarhely.nev}",
    "${tarhely.meret}",
    "${tarhely.ar}"
    );
    `);

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
