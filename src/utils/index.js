/* pasandole un objeto a esta funciona comprueba que sea un
objeto, y si es un objeto te devuelve el tamaño de ese objeto,
si no te devuelve un 0 */
const countObjectProperties = obj => {
  if (typeof obj === 'object') {
    return Object.keys(obj).length
  }
  return 0
}
/* Esta funcion recibe un objeto y recorre todas las propiedades, en caso de que alguna no tenga valor,
elimina es propiedad y devuelve el mismo objeto pero sin las propiedades vacias */
const removeEmptyProperties = obj => {
  const objCopy = {...obj}
  Object.keys(objCopy).forEach(key => {
    if ([null, undefined].includes(objCopy[key])) {
      delete objCopy[key]
    }
  })
  return objCopy
}

export {
  countObjectProperties,
  removeEmptyProperties
}
