package com.libcode.proyecto.appoyar.organization;

import jakarta.persistence.*;

@Entity
@Table(name = "organizaciones")
public class Organization {

    @Id
    @Column(name = "nit", nullable = false, unique = true, length = 14)
    private String nit;

    @Column(name = "nombre", nullable = false, length = 25)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "logo_url", length = 100)
    private String logoUrl;

    @Column(name = "nombre_inscriptor", length = 50)
    private String nombreInscriptor;

    @Column(name = "rol", length = 50)
    private String rol;

    @Column(name = "correo", length = 50)
    private String correo;

    @Column(name = "contraseña", length = 50)
    private String contraseña;


    public Organization() {
    }

    public Organization(String nit, String nombre, String descripcion, String logoUrl, 
                       String nombreInscriptor, String rol, String correo, String contraseña) {
        this.nit = nit;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.logoUrl = logoUrl;
        this.nombreInscriptor = nombreInscriptor;
        this.rol = rol;
        this.correo = correo;
        this.contraseña = contraseña;
    }

    // Getters and Setters
    public String getNit() { 
        return nit; 
    }
    
    public void setNit(String nit) { 
        this.nit = nit; 
    }

    public String getNombre() { 
        return nombre; 
    }
    
    public void setNombre(String nombre) { 
        this.nombre = nombre; 
    }

    public String getDescripcion() { 
        return descripcion; 
    }
    
    public void setDescripcion(String descripcion) { 
        this.descripcion = descripcion; 
    }

    public String getLogoUrl() { 
        return logoUrl; 
    }
    
    public void setLogoUrl(String logoUrl) { 
        this.logoUrl = logoUrl; 
    }

    public String getNombreInscriptor() { 
        return nombreInscriptor; 
    }
    
    public void setNombreInscriptor(String nombreInscriptor) { 
        this.nombreInscriptor = nombreInscriptor; 
    }

    public String getRol() { 
        return rol; 
    }
    
    public void setRol(String rol) { 
        this.rol = rol; 
    }

    public String getCorreo() { 
        return correo; 
    }
    
    public void setCorreo(String correo) { 
        this.correo = correo; 
    }

    public String getContraseña() { 
        return contraseña; 
    }
    
    public void setContraseña(String contraseña) { 
        this.contraseña = contraseña; 
    }

    @Override
    public String toString() {
        return "Organization{" +
                "nit='" + nit + '\'' +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", logoUrl='" + logoUrl + '\'' +
                ", nombreInscriptor='" + nombreInscriptor + '\'' +
                ", rol='" + rol + '\'' +
                ", correo='" + correo + '\'' +
                '}';
    }
}