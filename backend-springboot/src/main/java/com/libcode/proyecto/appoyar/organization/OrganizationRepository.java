package com.libcode.proyecto.appoyar.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, String> {
    List<Organization> findByNombreContainingIgnoreCase(String nombre);
    Optional<Organization> findByNit(String nit);
}