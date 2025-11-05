import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  private storeService = inject(StoreService);

  products: Product[] = [];

  // estado del formulario
  isEditing = false;
  editingProduct: Product | null = null;

  // modelo del formulario
  form: Product = {
    nombre: '',
    precio: 0,
    descripcion: '',
    imagenUrl: ''
  };

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.storeService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  startCreate() {
    this.isEditing = true;
    this.editingProduct = null;
    this.form = {
      nombre: '',
      precio: 0,
      descripcion: '',
      imagenUrl: ''
    };
  }

  onEdit(product: Product) {
    this.isEditing = true;
    this.editingProduct = product;
    // clon para no tocar el de la lista hasta guardar
    this.form = { ...product };
  }

  cancel() {
    this.isEditing = false;
  }

  save() {
    // asegurar que el precio es número
    this.form.precio = Number(this.form.precio);

    // EDITAR
    if (this.editingProduct && this.editingProduct.id) {
      this.storeService.updateProduct(this.editingProduct.id, this.form).subscribe({
        next: () => {
          this.isEditing = false;
          this.load();
        },
        error: (err) => console.error('Error actualizando producto', err)
      });
      return;
    }

    // CREAR
    this.storeService.createProduct(this.form).subscribe({
      next: () => {
        this.isEditing = false;
        this.load();
      },
      error: (err) => console.error('Error creando producto', err)
    });
  }

  onDelete(product: Product) {
    if (!product.id) return;
    if (!confirm('¿Eliminar este producto?')) return;

    this.storeService.deleteProduct(product.id).subscribe({
      next: () => this.load(),
      error: (err) => console.error('Error eliminando producto', err)
    });
  }
}
