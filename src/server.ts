import express from "express";
import { GroupedScansController } from "./controllers/GroupedScansController";

const app = express();
const PORT: number = 6060;
const controller = new GroupedScansController();

app.get('/grouped-scans', (req, res) => controller.getGroupedScans(req, res));

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
})