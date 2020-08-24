"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = exports.Mailer = void 0;
var nodemailer = require("nodemailer");
var SMTPTransport = require("nodemailer/lib/smtp-transport");
var fs = require("fs");
var path = require("path");
var lodash_1 = require("lodash");
var mjml2html = require("mjml");
var html2text = require("html-to-text");
var async = require("async");
var templateRender = function (src, context) { return lodash_1.template(src)(context); };
var asyncRetryOptions = { times: 5, interval: 200 };
var Mailer = (function () {
    function Mailer() {
    }
    Mailer.prototype.asyncSend = function (mail, options) {
        var _this = this;
        async.retry(__assign(__assign({}, this.__AsyncRetryOptions), options), function (done) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.__Transport.sendMail(mail)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Send Mail Error', error_1, mail);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); }, function (err) {
            if (err) {
                return console.error('Send Mail Finally Error', err, mail);
            }
            console.log('Send Mail Success', mail);
            return;
        });
    };
    Mailer.prototype.renderMail = function (filename, context) {
        var extname = path.extname(filename);
        var mjmlFile = path.resolve(this.__mailDir, filename);
        var tplString = '';
        if (!fs.existsSync(mjmlFile) || !/\.(mjml|html|html)$/.test(extname))
            return tplString;
        var mjnlString = fs.readFileSync(mjmlFile, 'utf-8');
        tplString = mjnlString;
        if (/\.(mjml)$/.test(extname)) {
            var mjmlParseResults = mjml2html(mjnlString);
            tplString = mjmlParseResults.html;
            mjmlParseResults.errors.length > 0 && console.log(mjmlParseResults.errors);
        }
        if (context) {
            tplString = this.__RenderString(tplString, context);
        }
        return tplString;
    };
    Mailer.prototype.sendMail = function (filename, mail, context) {
        var html = this.renderMail(filename, context);
        mail.html = html;
        mail.text = html2text.fromString(html);
        this.asyncSend(mail);
    };
    return Mailer;
}());
exports.Mailer = Mailer;
function Setting(setting) {
    return function (target) {
        var transport = new SMTPTransport(setting.smtpOptions);
        target.prototype.__SmtpOptions = setting.smtpOptions;
        target.prototype.__Transport = nodemailer.createTransport(transport);
        target.prototype.__mailDir = path.resolve(process.cwd(), setting.mailDir || 'mails');
        target.prototype.__RenderString = setting.renderString || templateRender;
        target.prototype.__AsyncRetryOptions = __assign(__assign({}, asyncRetryOptions), setting.asyncRetryOptions);
    };
}
exports.Setting = Setting;
