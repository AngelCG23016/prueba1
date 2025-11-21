import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { UserRolesService } from '../../services/user-roles.service';
import { Product } from '../../models/product.model';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  private storeService = inject(StoreService);
  private userRolesService = inject(UserRolesService);

  products: Product[] = [];

  // Variables para control de roles
  canEdit$: Observable<boolean>;
  canCreate$: Observable<boolean>;
  canDelete$: Observable<boolean>;

  // Variable para control de carga
  loading = true;

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

  constructor() {
    // Inicializar los observables de permisos
    this.canEdit$ = this.userRolesService.canEditProducts();
    this.canCreate$ = this.userRolesService.canEditProducts();
    this.canDelete$ = this.userRolesService.canEditProducts();
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true; 
    this.storeService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false; 
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.loading = false; 
      }
    });
  }

  startCreate() {
    this.canCreate$.pipe(take(1)).subscribe(canCreate => {
      if (!canCreate) {
        alert('No tienes permisos para crear productos');
        return;
      }
      this.isEditing = true;
      this.editingProduct = null;
      this.form = {
        nombre: '',
        precio: 0,
        descripcion: '',
        imagenUrl: ''
      };
    });
  }

  onEdit(product: Product) {
    this.canEdit$.pipe(take(1)).subscribe(canEdit => {
      if (!canEdit) {
        alert('No tienes permisos para editar productos');
        return;
      }
      this.isEditing = true;
      this.editingProduct = product;
      this.form = { ...product };
    });
  }

  cancel() {
    this.isEditing = false;
  }

  save() {
    const permission$ = this.editingProduct ? this.canEdit$ : this.canCreate$;
    
    permission$.pipe(take(1)).subscribe(canProceed => {
      if (!canProceed) {
        alert('No tienes permisos para guardar productos.');
        return;
      }

      this.form.precio = Number(this.form.precio);

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

      this.storeService.createProduct(this.form).subscribe({
        next: () => {
          this.isEditing = false;
          this.load();
        },
        error: (err) => console.error('Error creando producto', err)
      });
    });
  }

  onDelete(product: Product) {
    this.canDelete$.pipe(take(1)).subscribe(canDelete => {
      if (!canDelete) {
        alert('No tienes permisos para eliminar productos.');
        return;
      }
      
      if (!product.id) return;
      if (!confirm('¿Eliminar este producto?')) return;

      this.storeService.deleteProduct(product.id).subscribe({
        next: () => this.load(),
        error: (err) => console.error('Error eliminando producto', err)
      });
    });
  }
}