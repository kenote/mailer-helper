import { MailerHelper as mailerHelper, MailerSetting as mailerSetting, Setting as setting, parseMailer as ParseMailer } from './'

export class MailerHelper extends mailerHelper {}

export const MailerSetting: typeof mailerSetting

export interface Setting extends setting {}

export const parseMailer: typeof ParseMailer