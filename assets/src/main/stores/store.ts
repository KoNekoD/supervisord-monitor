import { Notificator } from '~/landing/stores/notificator';
import { LandingStore } from '~/landing/stores/landing-store';
import { TokenStorage } from '~/landing/stores/token-storage';

export class RootStore {
  private tokenStorage = new TokenStorage('auto-refresh', 'theme', 'allow-mutators');
  private notificator = new Notificator();

  landingStore = new LandingStore(this.notificator, this.tokenStorage);
}
