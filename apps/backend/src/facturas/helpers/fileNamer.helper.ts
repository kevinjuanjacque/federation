


export const fileNamer = (req: Express.Request, file: Express.Multer.File, cb:Function) => {


    if(!file) return cb( new Error('No se ha podido subir el archivo'));

    // const extension = file.mimetype.split("/").pop();
    cb(null, `${Date.now()}-${file.originalname}`)
}