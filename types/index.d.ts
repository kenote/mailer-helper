
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
export { Mailer, Setting } from '../src'

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
