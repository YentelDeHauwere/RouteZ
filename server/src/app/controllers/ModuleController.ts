import {
    NextFunction,
    Request,
    Response,
} from 'express';

import {
    default as jwtDecode
} from "jwt-decode";

import {
    IModule,
    ModuleItem, 
    User
} from '../models';

export default class ModuleController {
    public allModules = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            // Get bearer token
            if (!req.headers.authorization) {
                return res.status(401).json({
                    error: "Deze gebruiker bestaat niet.",
                });
            };

            const token = req.headers.authorization.slice(7);
            const payload = Object(jwtDecode(token));

            const { id } = payload;

            // Check if user exists
            const user = await User.findOne({_id: id});

            if (!user) {
                return res.status(401).json({
                    error: "Deze gebruiker bestaat niet.",
                });
            };

            // Check for pagination
            const { limit, skip } = req.query;

            let modules;

            if (limit && skip) {
                // modules = await ModuleItem.find().paginate({}, {
                //     limit: Number(limit),
                //     page: Number(skip),
                //     sort: {
                //         _createdAt: -1,
                //     },
                // });
            } else {
                modules = await ModuleItem.find().populate({path: '_pathIds'}).sort({_createdAt: -1}).exec();
            };

            return res.status(200).json(modules);
        } catch (e) {
            next(e);
        };
    };

    createModule = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { title, content } = req.body;

            const newModule: IModule = new ModuleItem({
                title: title,
                content: content,
            });

            const savedModule = await newModule.save();

            return res.status(200).json(savedModule);
        } catch (e) {
            next(e);
        };
    };

    editModule = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { title, content, paths } = req.body;
            const { id } = req.params;

            const result = await ModuleItem.findByIdAndUpdate(id, {
                $set: {
                    title: title,
                    content: content,
                    _pathIds: paths,
                }
            }).exec();

            return res.status(200).json(result);
        } catch (e) {
            next(e);
        };
    };

    getModule = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            // Get parameter
            const { moduleId } = req.params;

            // Get bearer token
            if (!req.headers.authorization) {
                return res.status(401).json({
                    error: "Deze gebruiker bestaat niet.",
                });
            };

            const token = req.headers.authorization.slice(7);
            const payload = Object(jwtDecode(token));

            const { id } = payload;

            // Check if user exists
            const user = await User.findOne({_id: id});

            if (!user) {
                return res.status(401).json({
                    error: "Deze gebruiker bestaat niet.",
                });
            };
            
            // Find module
            const moduleItem = await ModuleItem.findOne({_id: moduleId}).populate({path: 'materials', populate: {path: 'author'}}).populate('paths').exec();

            if (!moduleItem) {
                return res.status(404).json({
                    error: "Deze module bestaat niet.",
                });
            };

            return res.status(200).json(moduleItem);
        } catch(e) {
            next();
        };
    };

    publishModule = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { moduleId } = req.params;
            const { bool } = req.body;

            const moduleItem = await ModuleItem.findByIdAndUpdate(moduleId, {
                $set: {
                    published: bool,
                }
            })
            .exec();

            return res.status(200).json(moduleItem);
        } catch (e) {
            next(e);
        };
    };

    deleteModule = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { moduleId } = req.params;

            const moduleItem = await ModuleItem.findByIdAndDelete(moduleId)
            .exec();

            return res.status(200).json(moduleItem);
        } catch (e) {
            next(e);
        };
    };
};