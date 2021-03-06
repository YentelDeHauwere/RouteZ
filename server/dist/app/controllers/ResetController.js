"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const models_1 = require("../models");
class ResetController {
    constructor(config) {
        this.sendToken = async (req, res, next) => {
            // Is this a user?
            const { email } = req.body;
            const user = await models_1.User.findOne({ email: email });
            if (!user) {
                return res.status(404).json({
                    error: "Deze gebruiker lijkt niet te bestaan",
                });
            }
            ;
            // Is there already a token?
            const token = await models_1.Reset.findOne({ _userId: user._id });
            if (token) {
                return res.status(409).json({
                    error: "Er is al reeds een e-mail verstuurd.",
                });
            }
            ;
            const newToken = new models_1.Reset({
                _userId: user.id,
                token: crypto_1.default.randomBytes(64).toString('hex'),
                _expiresAt: Date.now(),
            });
            const saveToken = await newToken.save();
            // Initializing our setup
            const transporter = nodemailer_1.default.createTransport({
                host: this.config.mailer.host,
                port: this.config.mailer.port,
                secure: this.config.mailer.secure,
                auth: {
                    user: this.config.mailer.mail,
                    pass: this.config.mailer.pass,
                },
            });
            // Send mail
            const info = await transporter.sendMail({
                from: `"RouteZ" <${this.config.mailer.mail}>`,
                to: email,
                subject: "Tijd om je wachtwoord aan te passen",
                html: `<p>Via volgende link kan je je wachtwoord aanpassen: <a href="http://localhost:3000/reset/${saveToken.token}" target="_blank">http://localhost:3000/reset/${saveToken.token}</a></p>`,
            });
            return res.status(200).json(info);
        };
        this.destroyToken = async (req, res, next) => {
            // Get values
            const { token, password } = req.body;
            // Find token
            const reset = await models_1.Reset.findOne({ token: token });
            if (!reset) {
                return res.status(404).json({
                    error: "Deze token lijkt niet te bestaan",
                });
            }
            ;
            bcrypt_1.default.genSalt(10, (err, salt) => {
                bcrypt_1.default.hash(password, salt, async (err, hash) => {
                    // Update user
                    const user = await models_1.User.findByIdAndUpdate({
                        _id: reset._userId,
                    }, {
                        password: hash,
                    });
                    const deleteReset = await models_1.Reset.findOneAndRemove({
                        _id: reset._id,
                    });
                    return res.status(200).json(deleteReset);
                });
            });
        };
        this.config = config;
    }
    ;
}
exports.default = ResetController;
;
//# sourceMappingURL=ResetController.js.map