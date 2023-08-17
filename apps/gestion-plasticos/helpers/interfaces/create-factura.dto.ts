export class CreateFacturaDto {
  numero: number;
  fecha: Date;
  static: string;
  state: 'pagada' | 'pendiente' | 'anulada';
}
