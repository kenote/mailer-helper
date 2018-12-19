import * as nodemailer from 'nodemailer'
import * as smtpTransport from 'nodemailer-smtp-transport'
import * as Mail from 'nodemailer/lib/mailer'
import * as async from 'async'
import * as mjml2html from 'mjml'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as template from 'lodash/template'
import * as html2text from 'html-to-text'

interface Setting {
  mailOptions: smtpTransport.SmtpOptions;
  mailDir?: string;
  asyncRetryOptions?: {
    times?: number;
    interval?: number | ((retryCount: number) => number);
  }
  renderString?: (src: string, context: object) => string;
}

interface AsyncRetryOptions {
  times: number;
  interval: number | ((retryCount: number) => number);
}

export class MailerHelper {
  public __MailOptions: smtpTransport.SmtpOptions;
  public __Transports: Mail;
  public __AsyncRetryOptions: AsyncRetryOptions;
  public __MailDir: string;
  public __RenderString: (src: string, context: object) => string;

  public asyncSend (mail: Mail.Options, options?: AsyncRetryOptions): void {
    async.retry(options || this.__AsyncRetryOptions, (done: async.AsyncResultCallback<{}, Error>): void => {
      this.__Transports.sendMail(mail, (err: Error | null): void => {
        if (err) {
          console.error('Send Mail Error', err, mail) 
        }
        return done()
      })
    }, (err: Error | null | undefined): void => {
      if (err) {
        return console.error('Send Mail Finally Error', err, mail)
      }
      console.log('Send Mail Success', mail)
    })
  }

  public renderMail (filename: string, context?: object): string {
    let extname: string = path.extname(filename)
    let mjmlFile: string = path.resolve(this.__MailDir, filename)
    let tplString: string = ''
    try {
      let mjnlString: string = fs.readFileSync(mjmlFile, 'utf-8')
      tplString = /\.(mjml)/.test(extname) ? mjml2html(mjnlString).html : mjnlString
    } catch (error) {
      console.error(error)
    }
    let htmlString: string = context ? this.__RenderString(tplString, context) : tplString
    return htmlString
  }

  public sendMail (filename: string, mail: Mail.Options, context?: object): void {
    let html = this.renderMail(filename, context)
    mail.html = html
    mail.text = html2text.fromString(html)
    this.asyncSend(mail)
  }
}

export function MailerSetting (setting: Setting): any {
  return function (target: any): void {
    let mailOpts = smtpTransport(setting.mailOptions)
    target.prototype.__MailOptions = setting.mailOptions
    target.prototype.__Transports = nodemailer.createTransport(mailOpts)
    target.prototype.__AsyncRetryOptions = {
      times: 5, 
      interval: 200,
      ...setting.asyncRetryOptions
    }
    target.prototype.__MailDir = setting.mailDir || path.resolve(process.cwd(), 'mails')
    target.prototype.__RenderString = setting.renderString || ((src: string, context: object): string => template(src)(context))
  }
}
