import { Module } from '@nestjs/common';
import { PostgresModule } from './shared/modules/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './features/authentication/authentication.module';

@Module({
  imports: [ConfigModule.forRoot(), PostgresModule, AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
