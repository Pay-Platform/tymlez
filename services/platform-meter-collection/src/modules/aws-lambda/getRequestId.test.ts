import { restoreConsole, suppressConsole } from '@tymlez/test-libs/src/jest';
import type { Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { getRequestId } from './getRequestId';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('uuid 1'),
}));

beforeAll(() => {
  suppressConsole({ debug: false });
});

afterAll(() => {
  restoreConsole();
});

describe('getRequestId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return generated uuid when getting requestId without context', () => {
    expect(getRequestId({} as Context)).toBe('uuid 1');
    expect(uuidv4).toBeCalledTimes(1);
  });

  it('should return awsRequestId from the context', () => {
    expect(getRequestId({ awsRequestId: 'aws request id 1' } as Context)).toBe(
      'aws request id 1',
    );
    expect(uuidv4).toBeCalledTimes(0);
  });
});
