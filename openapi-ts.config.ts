import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: 'openapi.json',
  output: {
    path: './src/client',
    lint: false,
  },
  services: {
    asClass: true,
  },
  types: {
    enums: 'javascript', 
  },
  schemas: {
    export: true,
    type: 'json',
  },
});
