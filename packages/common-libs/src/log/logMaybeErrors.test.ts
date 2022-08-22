import { logMaybeErrors } from './logMaybeErrors';

jest.spyOn(console, 'error').mockImplementation(() => {
  // explicitly do nothing
});

describe('logMaybeErrors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log all errors when inputs and results have the same length', () => {
    logMaybeErrors({
      message: 'unit test error',
      inputs: ['input 1', 'input 2'],
      results: [new Error('error 1'), new Error('error 2')],
    });

    expect((console.error as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "unit test error",
          "results count: 2",
          "[
        {
          \\"input\\": \\"input 1\\",
          \\"errorMessage\\": \\"error 1\\",
          \\"error\\": {}
        },
        {
          \\"input\\": \\"input 2\\",
          \\"errorMessage\\": \\"error 2\\",
          \\"error\\": {}
        }
      ]",
        ],
      ]
    `);
  });

  it('should log 1 error when inputs and results have the same length, and only input 2 has error', () => {
    logMaybeErrors({
      message: 'unit test error',
      inputs: ['input 1', 'input 2'],
      results: [{ data: 1 }, new Error('error 2')],
    });

    expect((console.error as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "unit test error",
          "results count: 2",
          "[
        {
          \\"input\\": \\"input 2\\",
          \\"errorMessage\\": \\"error 2\\",
          \\"error\\": {}
        }
      ]",
        ],
      ]
    `);
  });

  it('should log all errors when inputs and results do not have the same length', () => {
    logMaybeErrors({
      message: 'unit test error',
      inputs: ['input 1'],
      results: [new Error('error 1'), new Error('error 2')],
    });

    expect((console.error as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "unit test error",
          "inputs count: 1, results count: 2",
          Array [
            "input 1",
          ],
          "[
        {
          \\"errorMessage\\": \\"error 1\\",
          \\"error\\": {}
        },
        {
          \\"errorMessage\\": \\"error 2\\",
          \\"error\\": {}
        }
      ]",
        ],
      ]
    `);
  });

  it('should log all errors when inputs and results do not have the same length', () => {
    logMaybeErrors({
      message: 'unit test error',
      inputs: ['input 1'],
      results: [{ data: 1 }, new Error('error 2')],
    });

    expect((console.error as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "unit test error",
          "inputs count: 1, results count: 2",
          Array [
            "input 1",
          ],
          "[
        null,
        {
          \\"errorMessage\\": \\"error 2\\",
          \\"error\\": {}
        }
      ]",
        ],
      ]
    `);
  });
});
