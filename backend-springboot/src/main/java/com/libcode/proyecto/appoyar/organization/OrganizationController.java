package com.libcode.proyecto.appoyar.organization;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

// Controlador REST que maneja todas las operaciones HTTP relacionadas con Organizaciones.
 
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/organizaciones")
public class OrganizationController {

    private final OrganizationService service;
    private static final Logger logger = LoggerFactory.getLogger(OrganizationController.class);
    
    private final String UPLOAD_DIR = "uploads/logos/";

    public OrganizationController(OrganizationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Organization> obtenerTodasLasOrganizaciones() {
        logger.info("Obteniendo todas las organizaciones");
        return service.obtenerTodasLasOrganizaciones();
    }

    @GetMapping("/{nit}")
    public ResponseEntity<?> obtenerOrganizacionPorNit(@PathVariable String nit) {
        try {
            logger.info("Obteniendo organización con NIT: {}", nit);
            Organization organizacion = service.obtenerOrganizacionPorNit(nit)
                    .orElseThrow(() -> new RuntimeException("Organización no encontrada con NIT: " + nit));
            return ResponseEntity.ok(organizacion);
        } catch (Exception e) {
            logger.error("Error obteniendo organización: {}", e.getMessage());
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crearOrganizacion(@RequestBody Organization organizacion) {
        try {
            logger.info("Creando nueva organización: {}", organizacion.getNombre());
            logger.info("Datos recibidos - NIT: {}, Nombre: {}, Inscriptor: {}", 
                       organizacion.getNit(), organizacion.getNombre(), organizacion.getNombreInscriptor());
            
            // Validaciones básicas de campos requeridos

            if (organizacion.getNit() == null || organizacion.getNit().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El NIT es requerido"));
            }
            
            // Validar que el NIT solo contenga números

            if (!organizacion.getNit().matches("^[0-9]+$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "El NIT solo puede contener números"));
            }
            
            // Validar longitud del NIT (máximo 14 caracteres)

            if (organizacion.getNit().length() > 14) {
                return ResponseEntity.badRequest().body(Map.of("error", "El NIT no puede tener más de 14 dígitos"));
            }
            
            if (organizacion.getNombre() == null || organizacion.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre de la organización es requerido"));
            }
            
            // Validar longitud del nombre máximo 25 caracteres

            if (organizacion.getNombre().length() > 25) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre no puede tener más de 25 caracteres"));
            }
            
            // Validar que el nombre solo contenga letras, números y espacios

            if (!organizacion.getNombre().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\\s]+$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre solo puede contener letras, números y espacios"));
            }
            
            if (organizacion.getNombreInscriptor() == null || organizacion.getNombreInscriptor().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre del inscriptor es requerido"));
            }
            
            // Validar longitud del nombre del inscriptor máximo 50 caracteres

            if (organizacion.getNombreInscriptor().length() > 50) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre del inscriptor no puede tener más de 50 caracteres"));
            }
            
            // Validar que el nombre del inscriptor solo contenga letras y espacios

            if (!organizacion.getNombreInscriptor().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre del inscriptor solo puede contener letras y espacios"));
            }
            
            if (organizacion.getRol() == null || organizacion.getRol().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El rol es requerido"));
            }
            
            // Validar longitud del rol máximo 50 caracteres

            if (organizacion.getRol().length() > 50) {
                return ResponseEntity.badRequest().body(Map.of("error", "El rol no puede tener más de 50 caracteres"));
            }
            
            // Validar que el rol solo contenga letras, números y espacios

            if (!organizacion.getRol().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\\s]+$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "El rol solo puede contener letras, números y espacios"));
            }
            
            if (organizacion.getCorreo() == null || organizacion.getCorreo().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo es requerido"));
            }
            
            // Validar longitud del correo máximo 50 caracteres

            if (organizacion.getCorreo().length() > 50) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo no puede tener más de 50 caracteres"));
            }
            
            if (organizacion.getContraseña() == null || organizacion.getContraseña().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "La contraseña es requerida"));
            }
            
            // Validar longitud mínima de contraseña

            if (organizacion.getContraseña().length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "La contraseña debe tener al menos 6 caracteres"));
            }
            
            Organization organizacionGuardada = service.guardarOrganizacion(organizacion);
            logger.info("Organización creada exitosamente con NIT: {}", organizacionGuardada.getNit());
            return ResponseEntity.ok(organizacionGuardada);
            
        } catch (Exception e) {
            logger.error("Error creando organización: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error al crear la organización",
                "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/{nit}")
    public ResponseEntity<?> actualizarOrganizacion(@PathVariable String nit, @RequestBody Organization organizacion) {
        try {
            logger.info("Actualizando organización con NIT: {}", nit);
            
            // Validaciones para actualización

            if (organizacion.getNombre() != null && organizacion.getNombre().length() > 25) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre no puede tener más de 25 caracteres"));
            }
            
            if (organizacion.getNombre() != null && !organizacion.getNombre().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\\s]+$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre solo puede contener letras, números y espacios"));
            }

            if (organizacion.getNombreInscriptor() != null && organizacion.getNombreInscriptor().length() > 50) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre del inscriptor no puede tener más de 50 caracteres"));
            }
            
            if (organizacion.getNombreInscriptor() != null && !organizacion.getNombreInscriptor().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre del inscriptor solo puede contener letras y espacios"));
            }
            
            if (organizacion.getRol() != null && organizacion.getRol().length() > 50) {
                return ResponseEntity.badRequest().body(Map.of("error", "El rol no puede tener más de 50 caracteres"));
            }
            
            if (organizacion.getRol() != null && !organizacion.getRol().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\\s]+$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "El rol solo puede contener letras, números y espacios"));
            }

            if (organizacion.getCorreo() != null && organizacion.getCorreo().length() > 50) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo no puede tener más de 50 caracteres"));
            }
            
            if (organizacion.getContraseña() != null && organizacion.getContraseña().length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "La contraseña debe tener al menos 6 caracteres"));
            }
            
            Organization organizacionActualizada = service.actualizarOrganizacion(nit, organizacion);
            return ResponseEntity.ok(organizacionActualizada);
            
        } catch (Exception e) {
            logger.error("Error actualizando organización: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error al actualizar la organización",
                "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{nit}")
    public ResponseEntity<?> eliminarOrganizacion(@PathVariable String nit) {
        try {
            logger.info("Eliminando organización con NIT: {}", nit);
            service.eliminarOrganizacion(nit);
            return ResponseEntity.ok().body(Map.of("message", "Organización eliminada exitosamente"));
            
        } catch (Exception e) {
            logger.error("Error eliminando organización: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error al eliminar la organización",
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/buscar")
    public List<Organization> buscarOrganizacionesPorNombre(@RequestParam String nombre) {
        logger.info("Buscando organizaciones con nombre: {}", nombre);
        return service.buscarOrganizacionesPorNombre(nombre);
    }

    @PostMapping("/upload-logo")
    public ResponseEntity<?> uploadLogo(@RequestParam("file") MultipartFile file) {
        try {
            logger.info("Subiendo archivo: {}", file.getOriginalFilename());
            
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
            }

            String contentType = file.getContentType();
            if (!List.of("image/jpeg", "image/png", "image/gif", "image/webp").contains(contentType)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tipo de archivo no permitido: " + contentType));
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "El archivo es demasiado grande. Máximo 5MB"));
            }

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            String fileUrl = "http://localhost:8080/" + UPLOAD_DIR + fileName;
            
            logger.info("Archivo subido exitosamente: {}", fileUrl);
            
            return ResponseEntity.ok(Map.of("url", fileUrl));
            
        } catch (IOException e) {
            logger.error("Error al subir archivo: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Error al subir el archivo: " + e.getMessage()));
        }
    }
}