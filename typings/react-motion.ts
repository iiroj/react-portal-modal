declare module 'react-motion' {
  type Config = {
    [key: string]: any;
  };

  export const spring: (num: number, config: Config) => void;
}
