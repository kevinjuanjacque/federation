import { promises } from 'dns';
import { facturaService } from '../../helpers/services/facturas.service';
import Factura from '../../models/facturas.model';
import fs from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: './tmp', // Carpeta donde se guardarán temporalmente los archivos
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo en el servidor
  },
});

const upload = multer({ storage }).single('file');

const index = async (req, res) => {
  console.log('req.method', req.method);
  switch (req.method) {
    case 'GET': {
      const data = await Factura.find();
      return res.status(200).json(data);
    }
    case 'POST': {
      try {
        const data = await new Promise((resolve, reject) => {
          upload(req, res, async function (err) {
            if (err) {
              console.error('Error al cargar el archivo:', err);
              reject('Error al cargar el archivo');
            }

            const uploadedFile = req.file;
            if (!uploadedFile) {
              reject('No se proporcionó ningún archivo');
            }

            // Hacer algo con el archivo (por ejemplo, moverlo, procesarlo, etc.)
            // Aquí, simplemente lo imprimimos en la consola
            console.log('Archivo cargado:', uploadedFile);

            // Eliminar el archivo temporal después de procesarlo si es necesario
            // fs.unlinkSync(uploadedFile.path);
            req.body.static = uploadedFile.path;
            console.log('uploadedFile', uploadedFile);
            // const data = await facturaService.createFactura(req.body);

            resolve(data);
          });
        });
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ message: error });
      }
    }
    default:
      return res.status(404).json({ message: 'Not found' });
  }
};

export default index;
