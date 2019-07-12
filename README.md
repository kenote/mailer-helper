# mailer-helper

Mailer's Helper.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Gratipay][licensed-image]][licensed-url]

## Installation

```bash
$ npm install kenote-mailer-helper
#
$ yarn add kenote-mailer-helper
```

## Usages

`mailer.ts`

```ts
import { Mailer, Setting } from 'kenote-mailer-helper'
import * as Mail from 'nodemailer/lib/mailer'

@Setting({
  smtpOptions: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'penelope.leuschke41@ethereal.email',
      pass: 'aPxRSFBXbM7dseEwKK'
    }
  },
  asyncRetryOptions: {
    times: 3,
    interval: 200
  },
  mailDir: 'mails',
  renderString: nunjucks.renderString
})
class NodeMailer extends Mailer {}

/** 
 * 发送邮件选项
 * @ from -- 发件人
 *   格式 -- 发件人名称 <发件人邮箱地址>
 * @ to -- 收件人
 *   格式 -- 收件人 <收件人邮箱地址>
 *   多个收件人用逗号分割
 * @ cc -- 抄送，可选项
 *   格式 -- 与收件人相同
 * @ bcc -- 密送，可选项
 *   格式 -- 与收件人相同
 * @ subject -- 标题
 *   格式 -- 字符串
 * @ text -- 正文，文本形式
 *   格式 -- 字符串
 * @ html -- 正文，HTML形式
 *   格式 -- HTML格式
 * @ attachments -- 附件，可选项
 *   格式 -- 数组
 *   [
 *     {
 *       filename: 'README.md',
 *       path: path.resolve(process.cwd(), 'README.md'),
 *       cid: '00000001'
 *     },
 *     {
 *       filename: 'README.md',
 *       content: '发送内容',
 *       cid: '00000002'
 *     }
 *   ]
 **/
const mail: Mail = {
  from: 'penelope.leuschke41@ethereal.email',
  to: 'penelope.leuschke41@ethereal.email',
  subject: 'Ethereal Email',
  text: 'Ethereal Email.'
}

const nodeMailer: NodeMailer = new NodeMailer()

// asyncSend
nodeMailer.asyncSend(mail)

// renderMail
nodeMailer.renderMail('email_verify.mjml', {})

// sendMail
nodeMailer.sendMail('email_verify.mjml', mail, {})
```

`email_verify.mjml`

```xml
<mjml>
  <mj-head>
    <mj-title>{{ site_name }}邮箱验证</mj-title>
    <mj-attributes>
      <mj-all font-size="15px" color="#646464" line-height="1.4" />
      <mj-class name="title" font-size="20px" color="#4e9c74" font-weight="bold" />
    <mj-attributes>
  </mj-head>
  <mj-body background-color="#ffffff" width="100%">
    <mj-section>
      <mj-column>
        <mj-text>亲爱的 {{ username }}:</mj-text>
        <mj-text>欢迎申请{{ site_name }}服务!</mj-text>
        <mj-text>你的{{ site_name }}帐号是: {{ username }}<br/>请点击下面的链接完成邮箱验证:</mj-text>
        <mj-text font-size="14px"><a href="{{ email_verify_url }}" target="_blank">{{ email_verify_url }}</a></mj-text>
        <mj-text>如果以上链接无法点击，请将该链接复制到浏览器（如 Chrome ）的地址栏中访问，也可以成功完成邮箱验证！</mj-text>
        <mj-spacer height="30px" />
        <mj-text>1. 为了保障您账号的安全性, 请在{{ timeout }}小时内完成验证, 此链接将在您激活过一次后失效!</mj-text>
        <mj-text>2. 如您没有注册过{{ site_name }}账号, 请您忽略此邮件, 由此给您带来的不便敬请谅解。</mj-text>
        <mj-spacer height="30px" />
        <mj-text>- {{ site_name }}<br/>(这是一封自动产生的Email，请勿回复)</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

## License

this repo is released under the [MIT License](https://github.com/kenote/mailer-helper/blob/master/LICENSE).

[npm-image]: https://img.shields.io/npm/v/kenote-mailer-helper.svg
[npm-url]: https://www.npmjs.com/package/kenote-mailer-helper
[downloads-image]: https://img.shields.io/npm/dm/kenote-mailer-helper.svg
[downloads-url]: https://www.npmjs.com/package/kenote-mailer-helper
[travis-image]: https://travis-ci.com/kenote/mailer-helper.svg?branch=master
[travis-url]: https://travis-ci.com/kenote/mailer-helper
[licensed-image]: https://img.shields.io/badge/license-MIT-blue.svg
[licensed-url]: https://github.com/kenote/mailer-helper/blob/master/LICENSE