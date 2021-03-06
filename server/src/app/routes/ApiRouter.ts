import {
    default as express,
    Router,
} from 'express';

import {
    default as multer,
    memoryStorage,
} from 'multer';

import {
    UserController,
    ResetController,
    FileController,
    ModuleController,
    SignpostController,
    PathController,
    ExerciseController,
    TagController,
    SearchController,
    NotificationController,
} from '../controllers';

import { 
    Auth,
    IConfig,
    Files,
} from '../services';

class ApiRouter {
    public router: Router;

    private userController: UserController;
    private resetController: ResetController;
    private fileController: FileController;
    private moduleController: ModuleController;
    private signpostController: SignpostController;
    private pathController: PathController;
    private exerciseController: ExerciseController;
    private tagController : TagController;
    private searchController: SearchController;
    private notificationController: NotificationController;

    private config: IConfig;
    private auth: Auth;

    constructor(config: IConfig, auth: Auth) {
        this.config = config;
        this.auth = auth;

        this.router = express.Router();

        // Initialize controllers and routes
        this.registerControllers();
        this.registerRoutes();
    };

    private registerControllers(): void {
        this.userController = new UserController(this.auth, this.config);
        this.resetController = new ResetController(this.config);
        this.fileController = new FileController();
        this.moduleController = new ModuleController();
        this.signpostController = new SignpostController();
        this.exerciseController = new ExerciseController();
        this.pathController = new PathController();
        this.tagController = new TagController();
        this.searchController = new SearchController();
        this.notificationController = new NotificationController();
    };

    private registerRoutes(): void {
        // Authentication routes
        this.router.post('/users/register', this.userController.newUser); // gives bearer
        this.router.post('/users/login', this.userController.loggingInUser); // gives bearer
        this.router.post('/users/admin', this.userController.loggingInAdmin); // gives bearer

        // Users
        this.router.get('/users', this.userController.allUsers); // needs bearer, only for admin
        this.router.get('/users/me', this.userController.getMyself); // needs bearer
        this.router.get('/users/:id', this.userController.getUser); // needs bearer and id
        this.router.get('/users-progress', this.userController.calculateUserProgress); // needs bearer
        this.router.patch('/users/:id', this.userController.editUser); // needs bearer and id, only for admin
        this.router.post('/users/me', this.userController.updateMyself); // needs bearer and body
        this.router.post('/users/me/progress', this.userController.updateProgress); // needs bearer and body
        this.router.post('/users/me/last', this.userController.updateLastProgress); // needs bearer and body
        this.router.post('/users/create', this.userController.createUser); // needs body, only admin
        this.router.delete('/users/me', this.userController.deleteMyself); // needs bearer
        this.router.delete('/users/:id', this.userController.deleteUser); // needs id, only admin
        this.router.get('/users-stats', this.userController.viewUserStats); // needs bearer, only admin

        // Reset password
        this.router.post('/reset/send', this.resetController.sendToken); // needs body
        this.router.post('/reset/submit', this.resetController.destroyToken); // needs body

        // Files
        this.router.post('/file', multer({storage: memoryStorage()}).single('picture'), Files.uploadAvatar, this.fileController.upload); // uploading avatar, needs formdata
        this.router.post('/doc', multer({storage: memoryStorage()}).single('file'), Files.uploadFile, this.fileController.upload); // uploading avatar, needs formdata
        this.router.get('/file/:filename', this.fileController.showImage); // needs filename as params
        this.router.get('/doc/:filename', this.fileController.showFile); // needs filename as params
        this.router.get('/svg/:filename', this.fileController.showSvg); // needs filename as params
        this.router.get('/material/:id', this.fileController.getMaterial); // needs bearer and params
        this.router.get('/material/current/:userId', this.fileController.myMaterials); // needs userId as params and bearer
        this.router.get('/material', this.fileController.allMaterials); // needs bearer
        this.router.post('/material', this.fileController.createMaterial); // needs bearer and body
        this.router.post('/material/search', this.fileController.showMaterial); // needs bearer and body
        this.router.post('/material/like', this.fileController.likeMaterial); // needs bearer and body
        this.router.post('/material/dislike', this.fileController.dislikeMaterial); // needs bearer and body
        this.router.post('/edit-material/:materialId', this.fileController.editMaterial); // needs bearer and body and params
        this.router.delete('/material/:id', this.fileController.deleteMaterial); // needs bearer and params

        // Modules
        this.router.get('/modules', this.moduleController.allModules); // needs bearer
        this.router.get('/modules/:moduleId', this.moduleController.getModule); // needs bearer
        this.router.post('/modules', this.moduleController.createModule); // needs bearer and body
        this.router.post('/modules/:id', this.moduleController.editModule); // only admin, needs param and body
        this.router.post('/publish-module/:moduleId', this.moduleController.publishModule); // needs bearer, body, only for admin
        this.router.delete('/modules/:moduleId', this.moduleController.deleteModule); // only admin, needs param and body

        // Signposts
        this.router.get('/signposts', this.signpostController.allSignposts); // needs bearer
        this.router.get('/signposts/:signpostId', this.signpostController.getSignpost); // needs bearer
        this.router.patch('/signposts/:signpostId', this.signpostController.editSignpost); // needs bearer
        this.router.post('/signposts', this.signpostController.createSignpost); // needs bearer, only for admin
        this.router.post('/publish-signpost/:signpostId', this.signpostController.publishSignpost); // needs bearer, body, only for admin
        this.router.patch('/signposts/add/:signpostId/:moduleId', this.signpostController.addModuleToSignpost); // needs bearer, only for admin
        this.router.patch('/signposts/remove/:signpostId/:moduleId', this.signpostController.removeModuleFromSignpost); // needs bearer, only for admin
        this.router.delete('/signposts/:id', this.signpostController.deleteSignpost); // needs bearer, only for admin

        // Paths
        this.router.get('/paths', this.pathController.allPaths); // needs bearer
        this.router.get('/paths/:pathId', this.pathController.getPath); // needs bearer
        this.router.post('/paths', this.pathController.createPath); // needs bearer, only for admin
        this.router.patch('/paths/add/:moduleId/:pathId', this.pathController.addPathToModule); // needs bearer, only for admin
        this.router.patch('/paths/remove/:moduleId/:pathId', this.pathController.removePathFromModule); // needs bearer, only for admin

        // Exercises
        this.router.get('/exercises', this.exerciseController.allExercises); // needs bearer
        this.router.get('/exercises/:exerciseId', this.exerciseController.getExercise); // needs bearer
        this.router.post('/exercises', this.exerciseController.createExercise); // needs bearer, only for admin
        this.router.patch('/exercises/:pathId/:exerciseId', this.exerciseController.addExerciseToPath); // needs bearer, only for admin

        // Tags
        this.router.get('/tags', this.tagController.allTags); // needs bearer
        this.router.get('/tags/:id', this.tagController.getTag); // needs bearer
        this.router.post('/tags', this.tagController.createTag); // needs bearer, only for admin
        this.router.delete('/tags/:id', this.tagController.deleteTag); // needs bearer, only for admin
        this.router.patch('/tags/:id', this.tagController.editTag); // needs bearer, body, admin

        // Searches
        this.router.post('/search-engine', this.searchController.searchItems); // needs bearer and body

        // Notifications
        this.router.post('/notification', this.notificationController.createNotification); // needs body
        this.router.get('/notifications', this.notificationController.getNotifications); // needs bearer
        this.router.get('/read-notifications', this.notificationController.readNotifications); // needs bearer
    };
};

export default ApiRouter;