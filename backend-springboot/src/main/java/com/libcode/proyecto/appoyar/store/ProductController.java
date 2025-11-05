package com.libcode.proyecto.appoyar.store;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/public/store")
@CrossOrigin(origins = "http://localhost:4200") // Angular
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // GET /api/public/store/products
    @GetMapping("/products")
    public List<Product> getAll() {
        return service.findAll();
    }

    // GET /api/public/store/products/{id}
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        Product p = service.findById(id);
        return (p != null) ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    // POST /api/public/store/products
    @PostMapping("/products")
    public ResponseEntity<Product> create(@RequestBody Product product) {
        Product created = service.create(product);
        return ResponseEntity
                .created(URI.create("/api/public/store/products/" + created.getId()))
                .body(created);
    }

    // PUT /api/public/store/products/{id}
    @PutMapping("/products/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        Product updated = service.update(id, product);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // DELETE /api/public/store/products/{id}
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
