import { LandingStore } from '~/landing/stores/landing-store';
import { TokenStorage } from '~/landing/stores/token-storage';

export class RootStore {
  private tokenStorage = new TokenStorage('auto-refresh', 'theme', 'allow-mutators');

  landingStore = new LandingStore(this.tokenStorage);
}
