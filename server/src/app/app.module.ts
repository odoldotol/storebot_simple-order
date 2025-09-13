import { AppModule } from '@modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';

AppModule.controllers = [AppController];
AppModule.providers = [AppService];
