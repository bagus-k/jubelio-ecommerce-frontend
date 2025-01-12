import dotenv from "dotenv";

dotenv.config();

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME,
    port: parseInt(process.env.NEXT_PUBLIC_APP_PORT || "3000"),
    api_base_url: process.env.NEXT_PUBLIC_BASE_URL,
  },
};
