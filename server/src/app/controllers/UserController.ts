import {
    Request,
    NextFunction,
    Response,
} from "express";

import { 
    User,
    IUser,
} from "../models";

import { 
    IConfig, 
    Auth 
} from "../services";

import {
    default as jwtDecode
} from "jwt-decode";

export default class UserController {
    private auth: Auth;
    private config: IConfig;

    constructor(auth: Auth, config: IConfig) {
        this.auth = auth;
        this.config = config;
    };

    // Getting all users
    public allUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
        try {
            // Only possible when you are a admin
            if (!req.headers.authorization) {
                return res.status(401).json({
                    error: "Deze gebruiker bestaat niet.",
                });
            };

            const token = req.headers.authorization.slice(7);
            const payload = Object(jwtDecode(token));

            const { id } = payload;

            const user = await User.findOne({ _id: id });

            // If user doesn't exist
            if (!user) {
                return res.status(404).json({
                    error: "Deze gebruiker bestaat niet."
                });
            };

            // if user isn't an admin
            if (user.role !== 'admin') {
                return res.status(401).json({
                    error: "Je kan deze optie niet gebruiken."
                });
            };

            // Pagination inserted
            const { limit, skip } = req.query;

            let users;

            if (limit && skip) {
                // Get user paginated
                users = await User.paginate({}, {
                    limit: 10,
                    page: 1,
                    sort: {
                        _createdAt: -1,
                    },
                });
            } else {
                // Get all users
                users = await User.find().sort({ _createdAt: -1 }).exec();
            };

            return res.status(200).json(users);
        } catch (e) {
            next(e);
        };
    };

    // Getting current user
    getMyself = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
        try {
            // Only you as a user will be given
            if (!req.headers.authorization) {
                return res.status(401).json({
                    error: "Deze gebruiker bestaat niet.",
                });
            };

            const token = req.headers.authorization.slice(7);
            const payload = Object(jwtDecode(token));

            const { id } = payload;

            const user = await User.findOne({ _id: id }); 
            
            // When user doesn't exist
            if (!user) {
                return res.status(404).json({
                    error: "Deze gebruiker bestaat niet."
                });
            };

            return res.status(200).json(user);
        } catch (e) {
            next(e);
        };
    };

    // Update a user
    updateMyself = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            // Main values to be edited
            const { email, firstName, lastName, schoolName, avatar, professionalFunction, phoneNumber } = req.body;

            // First off all, check if you're the user
            if (!req.headers.authorization) {
                return res.status(401).json({
                    error: "Deze gebruiker bestaat niet.",
                });
            };

            const token = req.headers.authorization.slice(7);
            const payload = Object(jwtDecode(token));

            const { id } = payload;

            const user = await User.findOne({ _id: id }); 

            if (!user) {
                return res.status(404).json({
                    error: "Deze gebruiker bestaat niet."
                });
            };

            // Updating the user
            const updatedUser = await User.findOneAndUpdate({ _id: id }, {
                $set: {
                    email: email,
                    'profile.firstName': firstName,
                    'profile.lastName': lastName,
                    'profile.schoolName': schoolName,
                    'profile.avatar': avatar,
                    'profile.professionalFunction': professionalFunction,
                    'profile.phoneNumber': phoneNumber,
                    _modifiedAt: Date.now(),
                },
            }, { new : true }).exec();

            return res.status(200).json(updatedUser);
        } catch (e) {
            next(e);
        };
    };

    updateProgress = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            // Main values to be edited
            const { moduleId, pathId, signpostId } = req.body;

            // First off all, check if you're the user
            if (!req.headers.authorization) {
                return res.status(401).json({
                    error: "Deze gebruiker bestaat niet.",
                });
            };

            const token = req.headers.authorization.slice(7);
            const payload = Object(jwtDecode(token));

            const { id } = payload;

            const user = await User.findOne({ _id: id }); 

            if (!user) {
                return res.status(404).json({
                    error: "Deze gebruiker bestaat niet."
                });
            };

            let updatedUser;

            if (moduleId) {
                let array = [];

                if (user.progress._finishedModuleIds.includes(moduleId)) return res.status(200).json({
                    message: "Deze module is al reeds toegevoegd",
                });

                if (!user.progress._finishedModuleIds || user.progress._finishedModuleIds.length === 0) {
                    array.push(moduleId);

                    // Updating the user
                    updatedUser = await User.findOneAndUpdate({ _id: id }, {
                        $set: {
                            'progress._finishedModuleIds': array,
                            _modifiedAt: Date.now(),
                        },
                    }, { new : true }).exec();
                } else {
                    // Updating the user
                    array = user.progress._finishedModuleIds;
                    array.push(moduleId);

                    updatedUser = await User.findOneAndUpdate({ _id: id }, {
                        $set: {
                            'progress._finishedModuleIds': array,
                            _modifiedAt: Date.now(),
                        },
                    }, { new : true }).exec();
                };
            };

            if (pathId) {
                let array = [];

                if (user.progress._finishedPathIds.includes(pathId)) return res.status(200).json({
                    message: "Dit pad is al reeds toegevoegd",
                });

                if (!user.progress._finishedPathIds || user.progress._finishedPathIds.length === 0) {
                    array.push(pathId);

                    // Updating the user
                    updatedUser = await User.findOneAndUpdate({ _id: id }, {
                        $set: {
                            'progress._finishedPathIds': array,
                            _modifiedAt: Date.now(),
                        },
                    }, { new : true }).exec();
                } else {
                    array = user.progress._finishedPathIds;
                    array.push(pathId);

                    // Updating the user
                    updatedUser = await User.findOneAndUpdate({ _id: id }, {
                        $set: {
                            'progress._finishedPathIds': array,
                            _modifiedAt: Date.now(),
                        },
                    }, { new : true }).exec();
                };
            };

            if (signpostId) {
                let array = [];

                if (user.progress._finishedSignPostIds.includes(signpostId)) return res.status(200).json({
                    message: "Deze wegwijzer is al reeds toegevoegd",
                });

                if (!user.progress._finishedSignPostIds || user.progress._finishedSignPostIds.length === 0) {
                    array.push(signpostId);

                    // Updating the user
                    updatedUser = await User.findOneAndUpdate({ _id: id }, {
                        $set: {
                            'progress._finishedSignPostIds': array,
                            _modifiedAt: Date.now(),
                        },
                    }, { new : true }).exec();
                } else {
                    array = user.progress._finishedSignPostIds;
                    array.push(signpostId);

                    // Updating the user
                    updatedUser = await User.findOneAndUpdate({ _id: id }, {
                        $set: {
                            'progress._finishedSignPostIds': array,
                            _modifiedAt: Date.now(),
                        },
                    }, { new : true }).exec();
                };
            };

            return res.status(200).json(updatedUser);
        } catch (e) {
            next(e);
        };
    };

    // Delete a user
    deleteMyself = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            // Get your bearer token
            if (!req.headers.authorization) {
                return res.status(401).json({
                    error: "Deze gebruiker bestaat niet.",
                });
            };
            
            const token = req.headers.authorization.slice(7);
            const payload = Object(jwtDecode(token));
    
            const { id } = payload;

            const user = await User.findOneAndRemove({ _id: id });

            if (!user) {
                return res.status(404).json({
                    error: "Deze gebruiker kan niet verwijderd worden.",
                });
            };

            return res.status(200).json(user);
        } catch(e) {
            next(e);
        };
    };

    // Registering a user
    newUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const { email } = req.body;
        console.log(email);

        // Check if user exists
        let existing = await User.findOne({ email: email });

        if (existing) {
            return res.status(403).json({ error: 'Er is al een gebruiker gemaakt met dit e-mailadres' });
        };

        // Fill in user data
        const newUser: IUser = new User(req.body);

        const user: IUser = await newUser.save();

        // Create a jwt token
        const jwtToken = this.auth.createToken(user);

        return res.status(200).json({
            token: jwtToken,
        });
    };

    // User logging in
    loggingInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.auth.passport.authenticate('local', {
            session: this.config.auth.jwt.session,
        }, (e, user) => {
            if (e) {
                return next(e);
            };

            // When user can't be found
            if (!user) {
                return res.status(404).json({
                    error: 'Er is iets verkeerd gelopen bij het aanmelden.'
                })
            };

            // Create a token
            const token = this.auth.createToken(user);

            return res.status(200).json({token: token, id: user._id});
        })(req, res, next);
    };
};