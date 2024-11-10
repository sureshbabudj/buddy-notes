import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.buddynote.app",
  appName: "buddynote",
  webDir: "dist",
  server: {
    url: "http://localhost:5173",
  },
};

export default config;
