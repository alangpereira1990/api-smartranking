import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}

    private readonly logger = new Logger(JogadoresService.name)

    async criarAtualizarJogador(criarJogadorDto:CriarJogadorDto):Promise<void>{        

        const { email } = criarJogadorDto
        const jogadorEncontrado = await this.getJogadorPorEmail(email)

        if (jogadorEncontrado){
          await this.atualizar(criarJogadorDto)
        } else {
          await this.criar(criarJogadorDto)
        }
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {

        return await this.jogadorModel.find().exec()
    }

    async consultaPorEmail(email: string): Promise<Jogador>{
        
        const jogadorEncontrado = await this.getJogadorPorEmail(email)
        
        if (!jogadorEncontrado) {
            throw new NotFoundException('Jogador não encontrado')
        } else {
            return jogadorEncontrado
        }
    }

    async deletarJogador(email:string): Promise<any>{

        return await this.jogadorModel.remove({email}).exec()
    }

    private async criar(criarJogadorDto:CriarJogadorDto): Promise<Jogador> {

        const jogadorCriado = new this.jogadorModel(criarJogadorDto)
        return await jogadorCriado.save()
    }

    private async atualizar(criarJogadorDto:CriarJogadorDto): Promise<Jogador>{

        return await this.jogadorModel.findOneAndUpdate({
            email: criarJogadorDto.email
        },{
            $set: criarJogadorDto
        }).exec()
    }

    private async getJogadorPorEmail(email:string):Promise<Jogador> {

        const jogador = await this.jogadorModel.findOne({email}).exec()

        return jogador
    }
}
