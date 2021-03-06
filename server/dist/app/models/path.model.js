"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathSchema = exports.Path = void 0;
// Path module
const mongoose_1 = __importStar(require("mongoose"));
;
const pathSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: false,
    },
    type: {
        type: String,
        required: true,
        enum: ['Theorie', 'Oefeningen'],
    },
    theoryText: [{
            title: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            images: [{
                    type: String,
                    required: false,
                }],
            order: {
                type: Number,
                required: true,
            }
        }],
    videoUrl: {
        type: String,
        required: false,
        unique: false,
    },
    _exerciseIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId, ref: 'Exercise', required: false,
        },
    ],
    _createdAt: {
        type: Number,
        required: true,
        default: Date.now(),
    },
    _modifiedAt: {
        type: Number,
        required: false,
        default: null,
    },
    _deletedAt: {
        type: Number,
        required: false,
        default: null,
    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
exports.pathSchema = pathSchema;
pathSchema.virtual('exercises', {
    ref: 'Exercise',
    localField: '_exerciseIds',
    foreignField: '_id',
    justOne: false,
});
const Path = mongoose_1.default.model('Path', pathSchema);
exports.Path = Path;
//# sourceMappingURL=path.model.js.map