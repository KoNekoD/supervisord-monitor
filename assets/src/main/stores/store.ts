import { LandingStore } from '~/landing/stores/landing-store';

export class RootStore {
  landingStore = new LandingStore();
}
