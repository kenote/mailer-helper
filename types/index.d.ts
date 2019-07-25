
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import * as Mail from 'nodemailer/lib/mailer'

/**
* 邮件发送类
*/
export declare class Mailer {

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
  public asyncSend (mail: Mail.Options): void
  public asyncSend (mail: Mail.Options, options: AsyncRetryOptions): void

  /**
    * 渲染邮件模版
    * @param filename string
    * @param context Maps<any>
    * @returns string 
    */
  public renderMail (filename: string): string
  public renderMail (filename: string, context: Maps<any>): string

  /**
    * 发送模版邮件
    * @param filename string
    * @param mail Mail.Options
    * @param context Maps<any>
    */
  public sendMail (filename: string, mail: Mail.Options): void
  public sendMail (filename: string, mail: Mail.Options, context: Maps<any>): void
}

/**
 * 类装饰器 -- 加载配置
 * @param setting MailerSetting
 */
export declare function Setting (setting: MailerSetting): any

export interface MailerSetting {

  /**
   * Mail SMTP 选项
   */
  smtpOptions        : SMTPTransport.Options

  /**
   * 模版路径
   */
  mailDir           ?: string

  /**
   * 模版渲染函数
   */
  renderString      ?: renderString

  /**
   * 异步重试选项
   */
  asyncRetryOptions ?: AsyncRetryOptions
}

export interface Maps<T> extends Record<string, T> {}

/**
 * 渲染函数
 */
export type renderString = (src: string, context: Maps<any>) => string

/**
 * 异步重试选项
 */
export interface AsyncRetryOptions extends Maps<any> {

  times              : number

  interval           : number | AsyncRetryOptionInterval

  errorFilter       ?: (error: Error) => boolean
}

export type AsyncRetryOptionInterval = (retryCount: number) => number

export interface MJMLParseError {

  line               : number

  message            : string

  tagName            : string

  formattedMessage   : string
}

export interface MJMLParseResults {

  html               : string

  errors             : MJMLParseError[]
}
