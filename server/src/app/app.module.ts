import { AppModule } from '@module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

AppModule.controllers = [AppController];
AppModule.providers = [AppService];
