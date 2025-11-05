export interface Product {
  id?: number;         // opcional porque al crear no hay id todavía
  nombre: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
}
