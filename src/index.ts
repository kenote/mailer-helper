import * as nodemailer from 'nodemailer'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import * as Mail from 'nodemailer/lib/mailer'
import * as fs from 'fs'
import * as path from 'path'
import { template } from 'lodash'
import * as mjml2html from 'mjml'
import * as html2text from 'html-to-text'
import { MailerSetting, renderString, AsyncRetryOptions, Maps, MJMLParseResults } from '../types'
import * as async from 'async'

const templateRender: renderString = (src, context) => template(src)(context)
const asyncRetryOptions: AsyncRetryOptions = { times: 5, interval: 200 }

/**
 * 邮件发送类
 */
export class Mailer {

  /**
   * Mail SMTP 选项
   */
  public __SmtpOptions: SMTPTransport.Options

  /**
   * Mail Transport 对象
   */
  public __Transport: Mail

  /**
   * 模版路径
   */
  public __mailDir: string

  /**
   * 模版渲染函数
   */
  public __RenderString: renderString

  /**
   * 异步重试选项
   */
  public __AsyncRetryOptions: AsyncRetryOptions

  /**
   * 异步发送邮件
   * @param mail Mail.Options
   * @param options AsyncRetryOptions
   */
  public asyncSend (mail: Mail.Options, options?: AsyncRetryOptions): void {
    async.retry({ ...this.__AsyncRetryOptions, ...options }, async done => {
      try {
        await this.__Transport.sendMail(mail)
      } catch (error) {
        console.error('Send Mail Error', error, mail)
      }
    }, err => {
      if (err) {
        return console.error('Send Mail Finally Error', err, mail)
      }
      console.log('Send Mail Success', mail)
      return
    })
  }

  /**
   * 渲染邮件模版
   * @param filename string
   * @param context Maps<any>
   * @returns string 
   */
  public renderMail (filename: string, context?: Maps<any>): string {
    let extname: string = path.extname(filename)
    let mjmlFile: string = path.resolve(this.__mailDir, filename)
    let tplString: string = ''
    if (!fs.existsSync(mjmlFile) || !/\.(mjml|html|html)$/.test(extname)) return tplString
    let mjnlString: string = fs.readFileSync(mjmlFile, 'utf-8')
    tplString = mjnlString
    if (/\.(mjml)$/.test(extname)) {
      let mjmlParseResults: MJMLParseResults = mjml2html(mjnlString)
      tplString = mjmlParseResults.html
      mjmlParseResults.errors.length > 0 && console.log(mjmlParseResults.errors)
    }
    if (context) {
      tplString = this.__RenderString(tplString, context)
    }
    return tplString
  }

  /**
   * 发送模版邮件
   * @param filename string
   * @param mail Mail.Options
   * @param context Maps<any>
   */
  public sendMail (filename: string, mail: Mail.Options, context?: Maps<any>): void {
    let html: string = this.renderMail(filename, context)
    mail.html = html
    mail.text = html2text.fromString(html)
    this.asyncSend(mail)
  }
}

/**
 * 类装饰器 -- 加载配置
 * @param setting MailerSetting
 */
export function Setting (setting: MailerSetting): any {
  return function (target: any): void {
    let transport: nodemailer.Transport = new SMTPTransport(setting.smtpOptions)
    target.prototype.__SmtpOptions = setting.smtpOptions
    target.prototype.__Transport = nodemailer.createTransport(transport)
    target.prototype.__mailDir = path.resolve(process.cwd(), setting.mailDir || 'mails')
    target.prototype.__RenderString = setting.renderString || templateRender
    target.prototype.__AsyncRetryOptions = { ...asyncRetryOptions, ...setting.asyncRetryOptions }
  }
}
