import express from "express";

const mainRouter = express.Router();

import {
  superAdminRoute,
  authRoute,
  locationRoute,
  packageRoute,
  templateRoute,
  emailGatewayRoute,
} from "../constant/routes.js";

import superAdminRouter from "../routes/superAdmin/superAdminRouter.js";
import authRouter from "../routes/userAuth/userAuthRouter.js";
import countryRouter from "./locations/countryRouter.js";
import provinceRouter from "./locations/provinceRouter.js";
import cityRouter from "./locations/cityRouter.js";
import packageRouter from "./subscriptionPackage/subscriptionPackageRouter.js";
import templateRouter from "./emailTemplate/emailtemplateRouter.js";
import emailGatewayRouter from "./emailGateway/emailGatewayRouter.js";

mainRouter.use(superAdminRoute, superAdminRouter);
mainRouter.use(authRoute, authRouter);
mainRouter.use(locationRoute, countryRouter);
mainRouter.use(locationRoute, provinceRouter);
mainRouter.use(locationRoute, cityRouter);
mainRouter.use(packageRoute, packageRouter);
mainRouter.use(templateRoute, templateRouter);
mainRouter.use(emailGatewayRoute, emailGatewayRouter);

export default mainRouter;
