import { ToCelsiusPipe } from './to-celsius.pipe';

describe('ToCelsiusPipe', () => {
  it('create an instance', () => {
    const pipe = new ToCelsiusPipe();
    expect(pipe).toBeTruthy();
  });
});
