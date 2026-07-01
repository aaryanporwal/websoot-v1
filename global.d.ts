declare module "*.css";

interface Window {
  posthog?: {
    capture: (eventName: string, properties?: Record<string, unknown>) => void;
  };
}
