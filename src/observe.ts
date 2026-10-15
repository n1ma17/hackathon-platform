import { createObserveModule } from '@nestjs/observe';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

export const observeEnabled = Boolean(
  process.env.OBSERVE_APP_KEY?.trim() && process.env.OBSERVE_APP_SECRET?.trim(),
);
