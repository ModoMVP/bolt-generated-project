import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'mail@modomvp.com.br',
    pass: 'Gma!01292'
  },
  from: {
    name: 'CRM Sistema',
    email: 'mail@modomvp.com.br'
  }
}));
