// Adiciona a propriedade 'user' ao Request do Express
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}