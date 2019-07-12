import * as isHtml from 'is-html'
import * as nunjucks from 'nunjucks'
import { Mailer, Setting } from '../src'

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

describe('\nMailer Test\n', () => {

  test('asyncSend Mail', () => {
    let nodeMailer: NodeMailer = new NodeMailer()
    nodeMailer.asyncSend({
      from: 'penelope.leuschke41@ethereal.email',
      to: 'penelope.leuschke41@ethereal.email',
      subject: 'Ethereal Email',
      text: 'Ethereal Email.'
    })
  })

  test('renderMail to HTML', () => {
    let nodeMailer: NodeMailer = new NodeMailer()
    let html: string = nodeMailer.renderMail('email_verify.mjml', {
      site_name: 'Kenote',
      username: 'thondery',
      email_verify_url: 'https://github.com/kenote/mailer-helper'
    })
    expect(isHtml(html)).toBe(true)
  })

  test('sendMail from MJML', () => {
    let nodeMailer: NodeMailer = new NodeMailer()
    nodeMailer.sendMail('email_verify.mjml', {
      from: 'penelope.leuschke41@ethereal.email',
      to: 'penelope.leuschke41@ethereal.email',
      subject: 'Ethereal Email'
    }, {
      site_name: 'Kenote',
      username: 'thondery',
      email_verify_url: 'https://github.com/kenote/mailer-helper'
    })
  })
})
