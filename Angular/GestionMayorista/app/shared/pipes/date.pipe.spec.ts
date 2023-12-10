import { CustomDatePipe } from "./customDate.pipe";

describe('DatePipe', () => {
  it('create an instance', () => {
    const pipe = new CustomDatePipe();
    expect(pipe).toBeTruthy();
  });
});
