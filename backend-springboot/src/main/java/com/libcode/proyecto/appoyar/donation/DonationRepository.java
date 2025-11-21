package com.libcode.proyecto.appoyar.donation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    
    List<Donation> findByOrganizacionNit(String nitOrganizacion);
    List<Donation> findByUsuarioId(Long usuarioId);
    List<Donation> findByOrganizacionNitAndUsuarioId(String nitOrganizacion, Long usuarioId);
    
    @Query("SELECT COALESCE(SUM(d.monto), 0) FROM Donation d WHERE d.organizacion.nit = :nitOrganizacion")
    Double sumMontoByOrganizacionNit(@Param("nitOrganizacion") String nitOrganizacion);
}