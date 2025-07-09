package com.inventory.Demo.model

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "dispositivos")
data class Dispositivo(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val dispositivoId: Long = 0,

    @Column(nullable = false, unique = true, length = 100)
    val serial: String,

    @Column(nullable = false, length = 100)
    val modelo: String,

    @Column(nullable = false, length = 50)
    val marca: String,

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    val categoria: Categoria,

    @ManyToOne
    @JoinColumn(name = "sede_id", nullable = false)
    val sede: Sede,

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    val estado: EstadoDispositivo,

    @Column(name = "fecha_adquisicion")
    val fechaAdquisicion: LocalDate? = null,

    @Column
    val costo: Double? = null,

    @Column(nullable = false, unique = true, length = 20)
    val codigoActivo: String,

    @Column(nullable = false, length = 50)
    val tipo: String,

    @Column(length = 100)
    val procesador: String? = null,

    @Column(length = 20)
    val ram: String? = null,

    @Column(length = 50)
    val almacenamiento: String? = null,

    @Column(name = "valor_compra", precision = 12, scale = 2)
    val valorCompra: Double? = null,

    @Column(name = "fecha_compra")
    val fechaCompra: LocalDate? = null,

    @Column(length = 100)
    val sistemaOperativo: String? = null,

    @Column(columnDefinition = "TEXT")
    val softwareAdicional: String? = null,

    @Column(columnDefinition = "TEXT")
    val observaciones: String? = null,

    // Campos nuevos para celulares
    @Column(length = 15)
    val imei1: String? = null,       // Ej: 868379040092180

    @Column(length = 15)
    val imei2: String? = null,       // Ej: 868379040642182

    @Column(length = 100)
    val emailAsociado: String? = null, // Ej: comercial124.sulicor@gmail.com

    @Column(length = 255)
    val contrasena: String? = null,   // Ej: Sulicor999# (considera encryptar este campo)

    @Column(columnDefinition = "TEXT")
    val estadoFisico: String? = null, // Ej: "Ajustado, rayado"

    @OneToMany(mappedBy = "dispositivo", cascade = [CascadeType.ALL], orphanRemoval = true)
    val accesorios: List<Accesorio> = emptyList(),

    @OneToMany(mappedBy = "dispositivo")
    val asignaciones: List<Asignacion> = emptyList(),

    @OneToMany(mappedBy = "dispositivo")
    val mantenimientos: List<Mantenimiento> = emptyList()
)

enum class EstadoDispositivo {
    DISPONIBLE, ASIGNADO, MANTENIMIENTO, BAJA
}