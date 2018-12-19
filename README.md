# mailer-helper
Mailer's Helper.

## Installation

```bash
$ yarn add kenote-mailer-helper
```

## Usages

`utils/mailer.ts`

```ts
import { MailerHelper, MailerSetting } from 'kenote-mailer-helper'

@MailerSetting({
  // Mailer options
  mailOptions: {
    host: '0.0.0.0',  // Server address
    port: 465,  // Server port, default 25 | 465
    secure: true, // use TLS
    auth: {
      user: 'username',
      pass: 'password'
    }
  },
  // Mail template directory
  mailDir: path.resolve(process.cwd(), 'mails'),
  // Rending Funtion, default use lodash/template
  renderString: nunjucks.renderString,
  // Failed retry option
  asyncRetryOptions: {
    times: 5,  // Number of Retries
    interval: 200  // Send interval
  }
})
class Mailer extends MailerHelper {

}

export default new Mailer()
```

`app.ts`

```ts
import * as Mail from 'nodemailer/lib/mailer'
import Mailer from './utils/mailer'

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
const mail: Mail.Options = {
  from: 'kenote <thondery@163.com>',
  to: 'thondery <thondery@xxx.com>',
  subject: '邮件标题',
}

const context: object = {
  site_name: 'kenote',
  username: 'thondery',
  email: 'thondery@163.com'
}

Mailer.sendMail('user.mjml', mail, context)
```

`mails/user.mjml`

```xml
<mjml>
  <mj-head>
    <mj-title>欢迎加入{{ site_name }}</mj-title>
    <mj-attributes>
      <mj-all font-size="16px" color="#797878" />
      <mj-class name="title" font-size="20px" color="#4e9c74" font-weight="bold" />
    <mj-attributes>
  </mj-head>
  <mj-body background-color="#ffffff">
    <mj-section>
      <mj-column>
        <mj-text mj-class="title">欢迎加入{{ site_name }}</mj-text>
        <mj-text>{{ username }}，您好！</mj-text>
        <mj-text>您已成为{{ site_name }}的会员，以下是您的账号信息：</mj-text>
        <mj-text>用户名：{{ username }}</mj-text>
        <mj-text>E-Mail：{{ email }}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

## License

this repo is released under the [MIT License](https://github.com/kenote/mailer-helper/blob/master/LICENSE).