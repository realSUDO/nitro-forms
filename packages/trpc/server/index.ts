import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { userRouter } from "./routes/user/route";
import { formRouter } from "./routes/form/route";
import { publicRouter } from "./routes/public/route";
import { analyticsRouter, responseRouter } from "./routes/analytics/route";
import { apiKeyRouter } from "./routes/api-key/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  user: userRouter,
  form: formRouter,
  public: publicRouter,
  analytics: analyticsRouter,
  response: responseRouter,
  apiKey: apiKeyRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
