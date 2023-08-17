import { jwtConstants } from '../../helpers/constanst';
import * as jose from 'jose';
const Auth = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    if (email === 'admin' && password === 'admin') {
      const token = await new jose.SignJWT({ email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('365 days')
        .sign(new TextEncoder().encode(jwtConstants.secret));
      console.log('token', token);
      return res.status(200).json({ token });
    }

    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.method === 'GET') {
    const token = req.headers['authorization']?.split(' ')[1];
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(jwtConstants.secret)
    );
    if (payload['email'] === 'admin')
      return res.status(200).json({ message: 'OK' });

    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(404).json({ message: 'Not found' });
};

export default Auth;
