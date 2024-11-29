import express from "express";
import initDatabase from "@database";
import { campaignRoute } from "@routes/CampaignRoute";

export const apiRoutes = express.Router();

initDatabase();

apiRoutes.use("/campaign", campaignRoute);

