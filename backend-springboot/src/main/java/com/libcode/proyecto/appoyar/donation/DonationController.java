package com.libcode.proyecto.appoyar.donation;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import com.libcode.proyecto.appoyar.user.UserService;
import com.libcode.proyecto.appoyar.user.User;
import com.libcode.proyecto.appoyar.organization.OrganizationService;
import com.libcode.proyecto.appoyar.organization.Organization;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/donaciones")
public class DonationController {

    private final DonationService donationService;
    private final UserService userService;
    private final OrganizationService organizationService;
    private static final Logger logger = LoggerFactory.getLogger(DonationController.class);

    public DonationController(DonationService donationService, UserService userService, OrganizationService organizationService) {
        this.donationService = donationService;
        this.userService = userService;
        this.organizationService = organizationService;
    }

    // Endpoint principal para procesar donaciones
    // Realiza validaciones completas de los datos recibidos, verifica la existencia del usuario y organización

    @PostMapping
    public ResponseEntity<?> registrarDonacion(@RequestBody Donation donation) {
        try {
            logger.info("Registrando nueva donación - Organización: {}", 
                donation.getOrganizacion() != null ? donation.getOrganizacion().getNit() : "null");
            
            // Validaciones básicas
            if (donation.getOrganizacion() == null || donation.getOrganizacion().getNit() == null || donation.getOrganizacion().getNit().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "La organización es requerida"));
            }
            
            if (donation.getUsuario() == null || donation.getUsuario().getId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "El usuario es requerido"));
            }
            
            // Verificar que el usuario existe
            Long usuarioId = donation.getUsuario().getId();
            logger.info("Buscando usuario con ID: {}", usuarioId);
            
            try {
                User usuarioExistente = userService.obtenerUsuarioPorId(usuarioId);
                donation.setUsuario(usuarioExistente);
                logger.info("Usuario encontrado: {} - {}", usuarioExistente.getNombre(), usuarioExistente.getCorreo());
            } catch (RuntimeException e) {
                logger.error("Usuario no encontrado con ID: {}", usuarioId);
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "El usuario no existe en el sistema",
                    "message", "No se encontró un usuario con ID: " + usuarioId
                ));
            }
            
            // Verificar que la organización existe
            String nitOrganizacion = donation.getOrganizacion().getNit();
            logger.info("Buscando organización con NIT: {}", nitOrganizacion);
            
            try {
                Organization organizacionExistente = organizationService.obtenerOrganizacionPorNit(nitOrganizacion)
                    .orElseThrow(() -> new RuntimeException("Organización no encontrada"));
                donation.setOrganizacion(organizacionExistente);
                logger.info("Organización encontrada: {} - {}", organizacionExistente.getNit(), organizacionExistente.getNombre());
            } catch (Exception e) {
                logger.error("Organización no encontrada con NIT: {}", nitOrganizacion);
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "La organización no existe en el sistema",
                    "message", "No se encontró una organización con NIT: " + nitOrganizacion
                ));
            }
            
            if (donation.getMonto() == null || donation.getMonto() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "El monto debe ser mayor a 0"));
            }
            
            if (donation.getMetodoPago() == null || donation.getMetodoPago().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El método de pago es requerido"));
            }

            if (donation.getFechaDonacion() == null) {
                donation.setFechaDonacion(java.time.LocalDateTime.now());
            }

            Donation donacionRegistrada = donationService.registrarDonacion(donation);
            logger.info("Donación registrada exitosamente - ID: {}, Monto: {}, Organización: {}, Usuario: {}", 
                       donacionRegistrada.getId(), donacionRegistrada.getMonto(), 
                       donacionRegistrada.getOrganizacion().getNit(),
                       donacionRegistrada.getUsuario().getId());
            
            return ResponseEntity.ok(donacionRegistrada);
            
        } catch (Exception e) {
            logger.error("Error registrando donación: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error al registrar la donación",
                "message", e.getMessage()
            ));
        }
    }

    // Consulta todas las donaciones realizadas a una organización específica identificada por su NIT

    @GetMapping("/organizacion/{nit}")
    public ResponseEntity<?> obtenerDonacionesPorOrganizacion(@PathVariable String nit) {
        try {
            logger.info("Obteniendo donaciones para organización: {}", nit);
            List<Donation> donaciones = donationService.obtenerDonacionesPorOrganizacion(nit);
            return ResponseEntity.ok(donaciones);
            
        } catch (Exception e) {
            logger.error("Error obteniendo donaciones: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error al obtener las donaciones",
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerDonacionesPorUsuario(@PathVariable Long idUsuario) {
        try {
            logger.info("Obteniendo donaciones para usuario ID: {}", idUsuario);
            List<Donation> donaciones = donationService.obtenerDonacionesPorUsuario(idUsuario);
            return ResponseEntity.ok(donaciones);
            
        } catch (Exception e) {
            logger.error("Error obteniendo donaciones: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error al obtener las donaciones",
                "message", e.getMessage()
            ));
        }
    }

    // Calcula la suma de todos los montos donados a una organización específica

    @GetMapping("/organizacion/{nit}/total")
    public ResponseEntity<?> obtenerTotalDonado(@PathVariable String nit) {
        try {
            logger.info("Calculando total donado para organización: {}", nit);
            Double total = donationService.obtenerTotalDonadoPorOrganizacion(nit);
            return ResponseEntity.ok(Map.of("total", total));
            
        } catch (Exception e) {
            logger.error("Error calculando total donado: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error al calcular el total donado",
                "message", e.getMessage()
            ));
        }
    }
}