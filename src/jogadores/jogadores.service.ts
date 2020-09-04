import { Injectable, Logger, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}

    private readonly logger = new Logger(JogadoresService.name)

    async criarJogador(criarJogadorDto:CriarJogadorDto):Promise<Jogador>{        

        const { email } = criarJogadorDto
        const jogadorEncontrado = await this.getJogadorPorEmail(email)

        if (jogadorEncontrado){
            throw new BadRequestException(`email ${email} já cadastrado!`)          
        } 
        return await this.criar(criarJogadorDto)        
    }

    async atualizarJogador(_id: string, atualizaJogadorDto:AtualizarJogadorDto):Promise<void>{        

        await this.getJogadorPorID(_id)
        await this.atualizar(_id,atualizaJogadorDto)
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {

        return await this.jogadorModel.find().exec()
    }

    async consultaPorID(_id: string): Promise<Jogador>{
        
        const jogador = await this.getJogadorPorID(_id)        
        return jogador
    }

    async deletarJogador(_id:string): Promise<any>{
        return await this.jogadorModel.deleteOne({_id}).exec()
    }

    /*private functions*/

    private async criar(criarJogadorDto:CriarJogadorDto): Promise<Jogador> {

        const jogadorCriado = new this.jogadorModel(criarJogadorDto)
        return await jogadorCriado.save()
    }

    private async atualizar(_id: string,atualizaJogadorDto:AtualizarJogadorDto): Promise<Jogador>{

        return await this.jogadorModel.findOneAndUpdate({
            _id
        },{
            $set: atualizaJogadorDto
        }).exec()
    }

    private async getJogadorPorEmail(email:string):Promise<Jogador> {

        const jogador = await this.jogadorModel.findOne({email}).exec()

        return jogador
    }

    private async getJogadorPorID(_id:string):Promise<Jogador> {

        const jogador = await this.jogadorModel.findOne({_id}).exec()

        if (!jogador){
            throw new NotFoundException(`Jogador com _id ${_id} não encontrado!`)
        }

        return jogador
    }
}
