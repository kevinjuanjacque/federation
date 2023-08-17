import { jwtSign, jwtVerify } from '../../lib/jwt';

const Auth = (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    if (email === 'admin' && password === 'admin') {
      const token = jwtSign({ email });
      return res.status(200).json({ token });
    }

    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.method === 'GET') {
    const token = req.headers['authorization']?.split(' ')[1];
    const payload = jwtVerify(token);
    if (payload['email'] === 'admin')
      return res.status(200).json({ message: 'OK' });

    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(404).json({ message: 'Not found' });
};

export default Auth;
