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
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var async = require("async");
var mjml2html = require("mjml");
var path = require("path");
var fs = require("fs-extra");
var template = require("lodash/template");
var html2text = require("html-to-text");
var MailerHelper = (function () {
    function MailerHelper() {
    }
    MailerHelper.prototype.asyncSend = function (mail, options) {
        var _this = this;
        async.retry(options || this.__AsyncRetryOptions, function (done) {
            _this.__Transports.sendMail(mail, function (err) {
                if (err) {
                    console.error('Send Mail Error', err, mail);
                }
                return done();
            });
        }, function (err) {
            if (err) {
                return console.error('Send Mail Finally Error', err, mail);
            }
            console.log('Send Mail Success', mail);
        });
    };
    MailerHelper.prototype.renderMail = function (filename, context) {
        var extname = path.extname(filename);
        var mjmlFile = path.resolve(this.__MailDir, filename);
        var tplString = '';
        try {
            var mjnlString = fs.readFileSync(mjmlFile, 'utf-8');
            tplString = /\.(mjml)/.test(extname) ? mjml2html(mjnlString).html : mjnlString;
        }
        catch (error) {
            console.error(error);
        }
        var htmlString = context ? this.__RenderString(tplString, context) : tplString;
        return htmlString;
    };
    MailerHelper.prototype.sendMail = function (filename, mail, context) {
        var html = this.renderMail(filename, context);
        mail.html = html;
        mail.text = html2text.fromString(html);
        this.asyncSend(mail);
    };
    return MailerHelper;
}());
exports.MailerHelper = MailerHelper;
function MailerSetting(setting) {
    return function (target) {
        var mailOpts = smtpTransport(setting.mailOptions);
        target.prototype.__MailOptions = setting.mailOptions;
        target.prototype.__Transports = nodemailer.createTransport(mailOpts);
        target.prototype.__AsyncRetryOptions = __assign({ times: 5, interval: 200 }, setting.asyncRetryOptions);
        target.prototype.__MailDir = setting.mailDir || path.resolve(process.cwd(), 'mails');
        target.prototype.__RenderString = setting.renderString || (function (src, context) { return template(src)(context); });
    };
}
exports.MailerSetting = MailerSetting;
