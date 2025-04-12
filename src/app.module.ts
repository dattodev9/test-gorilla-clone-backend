import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostgresModule } from './shared/modules/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { UserProfileModule } from './features/user-profile/user-profile.module';
import { AuthenticationMiddleware } from './middlewares/authentication.middlewares';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from './shared/modules/jwt-auth/jwt.module';
import { TestModule } from './features/test/test.module';
import { AssessmentModule } from './features/assessment/assessment.module';
import { CandidateModule } from './features/candidate/candidate.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    PostgresModule,
    AuthenticationModule,
    UserProfileModule,
    TypeOrmModule.forFeature([User]),
    JwtModule,
    TestModule,
    AssessmentModule,
    CandidateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: '/sign-in', method: RequestMethod.POST },
        { path: '/sign-up', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
