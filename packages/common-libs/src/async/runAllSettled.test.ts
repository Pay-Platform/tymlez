import { runAllSettled } from './runAllSettled';

describe('runAllSettled', () => {
  describe('given the callback pass, when called with empty array input', () => {
    const callback = jest.fn().mockReturnValue({ output: 1 });
    let result: any[];

    beforeAll(async () => {
      result = await runAllSettled([], callback);
    });

    it('should return empty array', () => {
      expect(result).toEqual([]);
    });

    it('should not call the callback', () => {
      expect(callback).toHaveBeenCalledTimes(0);
    });
  });

  describe('given the callback pass, when called with array 1 non error item', () => {
    const callback = jest.fn().mockReturnValue({ output: 1 });
    let result: any[];

    beforeAll(async () => {
      result = await runAllSettled([{ input: 1 }], callback);
    });

    it('should return array with 1 item from callback', () => {
      expect(result).toEqual([{ output: 1 }]);
    });

    it('should call the callback once', () => {
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({ input: 1 }, 0);
    });
  });

  describe('given the callback pass, when called with array 2 non error items', () => {
    const callback = jest.fn().mockReturnValue({ output: 1 });
    let result: any[];

    beforeAll(async () => {
      result = await runAllSettled([{ input: 1 }, { input: 2 }], callback);
    });

    it('should return array with 2 item from callback', () => {
      expect(result).toEqual([{ output: 1 }, { output: 1 }]);
    });

    it('should call the callback twice', () => {
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.mock.calls[0]).toEqual([{ input: 1 }, 0]);
      expect(callback.mock.calls[1]).toEqual([{ input: 2 }, 1]);
    });
  });

  describe(`given the callback pass, 
            when called with array 2 items, 1 is error`, () => {
    const callback = jest.fn().mockReturnValue({ output: 1 });
    let result: any[];

    beforeAll(async () => {
      result = await runAllSettled(
        [{ input: 1 }, new Error('test error 1')],
        callback,
      );
    });

    it('should return array with 2 item from callback', () => {
      expect(result).toEqual([{ output: 1 }, new Error('test error 1')]);
    });

    it('should call the callback once with the non-error item', () => {
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback.mock.calls[0]).toEqual([{ input: 1 }, 0]);
    });
  });

  describe(`given the callback fail on the 2nd item, 
            when called with array 2 non error items`, () => {
    const callback = jest.fn().mockImplementation((item, index) => {
      if (index === 1) {
        throw new Error('test error');
      }

      return item;
    });
    let result: any[];

    beforeAll(async () => {
      result = await runAllSettled([{ input: 1 }, { input: 2 }], callback);
    });

    it('should return array with 2 item from callback', () => {
      expect(result).toEqual([{ input: 1 }, new Error('test error')]);
    });

    it('should call the callback twice', () => {
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.mock.calls[0]).toEqual([{ input: 1 }, 0]);
      expect(callback.mock.calls[1]).toEqual([{ input: 2 }, 1]);
    });
  });
});
