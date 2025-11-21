package com.libcode.proyecto.appoyar.organization;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

//  Servicio que contiene la lógica de negocio para las operaciones con Organizaciones

@Service
@Transactional
public class OrganizationService {
    private final OrganizationRepository repository;

    public OrganizationService(OrganizationRepository repository) {
        this.repository = repository;
    }

      // Obtiene todas las organizaciones registradas en el sistema

    public List<Organization> obtenerTodasLasOrganizaciones() {
        return repository.findAll();
    }

    // Busca una organización por su NIT

    public Optional<Organization> obtenerOrganizacionPorNit(String nit) {
        return repository.findByNit(nit);
    }

    // Guarda una nueva organización en la base de datos

    public Organization guardarOrganizacion(Organization organizacion) {
        // Verificar si ya existe una organización con el mismo NIT
        if (organizacion.getNit() != null) {
            Optional<Organization> existente = repository.findByNit(organizacion.getNit());
            if (existente.isPresent()) {
                throw new RuntimeException("Ya existe una organización con NIT: " + organizacion.getNit());
            }
        }
        return repository.save(organizacion);
    }

    // Actualiza una organización existente

    public Organization actualizarOrganizacion(String nit, Organization organizacionActualizada) {
        return repository.findByNit(nit)
                .map(organizacionExistente -> {
                    // Actualiza solo los campos permitidos
                    organizacionExistente.setNombre(organizacionActualizada.getNombre());
                    organizacionExistente.setDescripcion(organizacionActualizada.getDescripcion());
                    organizacionExistente.setLogoUrl(organizacionActualizada.getLogoUrl());
                    organizacionExistente.setNombreInscriptor(organizacionActualizada.getNombreInscriptor());
                    organizacionExistente.setRol(organizacionActualizada.getRol());
                    organizacionExistente.setCorreo(organizacionActualizada.getCorreo());
                    organizacionExistente.setContraseña(organizacionActualizada.getContraseña());
                    return repository.save(organizacionExistente);
                })
                .orElseThrow(() -> new RuntimeException("Organización no encontrada con NIT: " + nit));
    }

    // Elimina una organización del sistema

    public void eliminarOrganizacion(String nit) {
        Organization organizacion = repository.findByNit(nit)
                .orElseThrow(() -> new RuntimeException("Organización no encontrada con NIT: " + nit));
        repository.delete(organizacion);
    }

    public List<Organization> buscarOrganizacionesPorNombre(String nombre) {
        return repository.findByNombreContainingIgnoreCase(nombre);
    }
}