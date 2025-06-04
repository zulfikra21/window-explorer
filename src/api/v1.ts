import createFolderController from "../controllers/CreateFolder.controller";
import getFoldersController from "../controllers/GetFolders.controller";

export default function v1(app: any) {
    // folders API version 1
    return app.group("/folders", (_app: any) =>
        _app
            .post("/", createFolderController)
            .get("/", getFoldersController)
            .get("/:parentId", getFoldersController)
    );
}