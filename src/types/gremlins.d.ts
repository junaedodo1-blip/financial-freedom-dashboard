declare module "gremlins.js" {
  export function createHorde(options?: Record<string, unknown>): {
    unleash: () => Promise<void>;
    stop: () => void;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
  };
  export const species: {
    clicker: (options?: Record<string, unknown>) => unknown;
    formFiller: (options?: Record<string, unknown>) => unknown;
    scroller: (options?: Record<string, unknown>) => unknown;
    typer: (options?: Record<string, unknown>) => unknown;
  };
  export const mogwais: {
    alert: (options?: Record<string, unknown>) => unknown;
    fps: (options?: Record<string, unknown>) => unknown;
  };
  export const strategies: {
    distribution: (options?: Record<string, unknown>) => unknown;
  };
}
