import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
//import { logger } from '../utils/logger';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>(
          'DB_CONNECTION_STRING',
        );
        console.log('URI do Mongo:', connectionString);

        // Adicionando o logger personalizado
        //const Logger = new logger();
        //Logger.log('Conectando ao banco de dados...');
        console.log('Conectando ao banco de dados...');

        return {
          uri: connectionString,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('Conexão com o banco de dados bem-sucedida');
            });
            connection.on('error', (err: any) => {
              console.log(`Falha ao conectar com o banco: ${err}`);
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
