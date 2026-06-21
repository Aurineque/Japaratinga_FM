declare module "@testing-library/react-native" {
  export function render(
    ui: React.ReactElement
  ): {
    getByText: (text: string | RegExp) => any
    getByRole: (role: string) => any
    queryByText: (text: string | RegExp) => any
    queryByRole: (role: string) => any
  }
}

declare function describe(name: string, fn: () => void): void
declare function it(name: string, fn: () => void): void
declare function beforeEach(fn: () => void): void
declare function expect(value: any): {
  toBe: (expected: any) => void
  toBeNull: () => void
  toBeTruthy: () => void
}
