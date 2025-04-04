import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostgresModule } from './shared/modules/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { UserProfileModule } from './features/user-profile/user-profile.module';
import { AuthenticationMiddleware } from './middlewares/authentication.middlewares';

@Module({
  imports: [ConfigModule.forRoot(), PostgresModule, AuthenticationModule, UserProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: '/sign-in', method: RequestMethod.POST },
      )
    }
}