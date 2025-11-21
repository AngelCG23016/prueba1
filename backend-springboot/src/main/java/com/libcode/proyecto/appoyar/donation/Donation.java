package com.libcode.proyecto.appoyar.donation;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.libcode.proyecto.appoyar.user.User;
import com.libcode.proyecto.appoyar.organization.Organization;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "donaciones")
public class Donation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Relación muchos a uno con Organization
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nit_organizacion", nullable = false, referencedColumnName = "nit")
    @JsonIgnoreProperties({"donaciones", "contraseña"}) 
    private Organization organizacion;

    // Relación muchos a uno con User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({"donaciones"}) 
    private User usuario;
    
    @Column(name = "monto", nullable = false)
    private Double monto;
    
    @Column(name = "metodo_pago", nullable = false, length = 20)
    private String metodoPago;
    
    @Column(name = "fecha_donacion", nullable = false)
    private LocalDateTime fechaDonacion;
    
    @Column(name = "estado", nullable = false, length = 20)
    private String estado;
    
    @Column(name = "referencia_pago", length = 50)
    private String referenciaPago;

    public Donation() {
        this.fechaDonacion = LocalDateTime.now();
        this.estado = "COMPLETADO";
    }

    // Constructor que acepta una organización existente
    public Donation(Organization organizacion, User usuario, Double monto, 
                   String metodoPago, String referenciaPago) {
        this();
        this.organizacion = organizacion;
        this.usuario = usuario;
        this.monto = monto;
        this.metodoPago = metodoPago;
        this.referenciaPago = referenciaPago;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Organization getOrganizacion() { return organizacion; }
    public void setOrganizacion(Organization organizacion) { this.organizacion = organizacion; }
    
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
    
    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }
    
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    
    public LocalDateTime getFechaDonacion() { return fechaDonacion; }
    public void setFechaDonacion(LocalDateTime fechaDonacion) { this.fechaDonacion = fechaDonacion; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public String getReferenciaPago() { return referenciaPago; }
    public void setReferenciaPago(String referenciaPago) { this.referenciaPago = referenciaPago; }
}