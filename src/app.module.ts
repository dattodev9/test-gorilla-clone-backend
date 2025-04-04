import { Module } from '@nestjs/common';
import { PostgresModule } from './shared/modules/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { UserProfileModule } from './features/user-profile/user-profile.module';

@Module({
  imports: [ConfigModule.forRoot(), PostgresModule, AuthenticationModule, UserProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
