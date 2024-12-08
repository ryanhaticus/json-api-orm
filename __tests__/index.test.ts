describe('`index`', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should configure `globalThis._JSONAPIORM with defaults`', async () => {
    await import('../src/index.ts');

    expect(globalThis._JSONAPIORM).toStrictEqual({
      engine: 'DYNAMODB',
    });
  });
});
