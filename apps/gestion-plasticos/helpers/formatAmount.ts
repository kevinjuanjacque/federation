export function formatMoney(amount: string) {
  // Convertir el número a una cadena y eliminar cualquier caracter que no sea dígito
  const amountStr = String(amount).replace(/\D/g, '');

  // Dar formato al número agregando puntos para separar los miles
  let formattedAmount = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Agregar el símbolo "$" al principio de la cadena
  formattedAmount = `$ ${formattedAmount}`;

  return formattedAmount;
}
