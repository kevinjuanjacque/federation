export class CreateBoletaDto  {
    nombreCliente: string;
    rutCliente: string;
    dirCliente: string;
    bultos: string;
    fecha: Date;
    iva: Boolean = false;
    detalle:{bolsa:string,cantidad:string,precio:string,tipo:"Normal"|"Especial"}[]
    precio:{
        precioNormal:string,
        precioEspecial:string,
    }
}