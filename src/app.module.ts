import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:bPQLeloBIHWXoHSU@cluster0.b7nrr.mongodb.net/smartranking?retryWrites=true&w=majority',
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
    ),
    JogadoresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
