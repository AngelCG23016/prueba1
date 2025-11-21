package com.libcode.proyecto.appoyar.donation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

//Servicio para manejar las operaciones de donaciones

@Service
@Transactional
public class DonationService {
    
    private final DonationRepository donationRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    //Registra una nueva donación en el sistema
    
    public Donation registrarDonacion(Donation donation) {
        return donationRepository.save(donation);
    }

    //Obtiene todas las donaciones de una organización

    public List<Donation> obtenerDonacionesPorOrganizacion(String nitOrganizacion) {
        return donationRepository.findByOrganizacionNit(nitOrganizacion);
    }

    //Obtiene todas las donaciones de un usuario por su ID
    
    public List<Donation> obtenerDonacionesPorUsuario(Long idUsuario) {
        return donationRepository.findByUsuarioId(idUsuario);
    }

    //Obtiene el historial de donaciones de un usuario a una organización específica
    
    public List<Donation> obtenerHistorialDonaciones(String nitOrganizacion, Long idUsuario) {
        return donationRepository.findByOrganizacionNitAndUsuarioId(nitOrganizacion, idUsuario);
    }

    //Obtiene el total donado a una organización
    
    public Double obtenerTotalDonadoPorOrganizacion(String nitOrganizacion) {
        return donationRepository.sumMontoByOrganizacionNit(nitOrganizacion);
    }
}