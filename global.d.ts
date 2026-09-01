declare module "*.css";

declare module "howler" {
  export class Howl {
    constructor(options: {
      src: string[];
      volume?: number;
      preload?: boolean;
    });
    play(): number;
  }
}

interface Window {
  posthog?: {
    capture: (eventName: string, properties?: Record<string, unknown>) => void;
  };
}
