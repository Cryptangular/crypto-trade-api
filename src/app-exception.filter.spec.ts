import { AppExceptionFilter } from './app-exception.filter';

describe('SettingsFilter', () => {
  it('should be defined', () => {
    expect(new AppExceptionFilter()).toBeDefined();
  });
});
