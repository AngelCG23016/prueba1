package com.libcode.proyecto.appoyar.user;
import jakarta.persistence.*;
import java.util.List;
import com.libcode.proyecto.appoyar.donation.Donation;
import com.fasterxml.jackson.annotation.JsonIgnore; 

@Entity
@Table(name = "usuarios")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") 
    private Long id;

    @Column(name = "nombre", nullable = false, length = 255) 
    private String nombre;

    @Column(name = "correo", nullable = false, unique = true, length = 255)
    private String correo;
    
    @Column(name = "password_hash", length = 255) 
    private String passwordHash;

    // Relación uno a muchos con Donation 
    @JsonIgnore
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Donation> donaciones;

    public User() {
    }

    public User(String nombre, String correo, String passwordHash) {
        this.nombre = nombre;
        this.correo = correo;
        this.passwordHash = passwordHash;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public List<Donation> getDonaciones() { return donaciones; }
    public void setDonaciones(List<Donation> donaciones) { this.donaciones = donaciones; }
}