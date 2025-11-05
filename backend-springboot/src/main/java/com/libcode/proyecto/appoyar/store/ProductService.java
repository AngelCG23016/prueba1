package com.libcode.proyecto.appoyar.store;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> findAll() {
        return repo.findAll();
    }

    public Product findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Product create(Product p) {
      return repo.save(p);
    }

    public Product update(Long id, Product incoming) {
        return repo.findById(id)
                .map(existing -> {
                    existing.setNombre(incoming.getNombre());
                    existing.setDescripcion(incoming.getDescripcion());
                    existing.setPrecio(incoming.getPrecio());
                    existing.setImagenUrl(incoming.getImagenUrl());
                    return repo.save(existing);
                })
                .orElse(null);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
