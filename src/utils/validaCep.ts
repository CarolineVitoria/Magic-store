export const validaCep = (cep:string): boolean =>{
    const regexCep = /^\d{5}-?\d{3}$/
    if(typeof cep != "string"){
      cep = String(cep);
    }
  
    if(!regexCep.test(cep)) {
        return false
    }
    return true;
}