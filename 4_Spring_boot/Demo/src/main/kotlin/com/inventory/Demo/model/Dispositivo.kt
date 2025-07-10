package com.inventory.Demo.model

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "dispositivos")
@DiscriminatorColumn(name = "tipo_dispositivo", discriminatorType = DiscriminatorType.STRING)
abstract class Dispositivo(
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

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    val empleado: Empleado? = null,

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

    @Column(columnDefinition = "TEXT")
    val observaciones: String? = null
)

enum class EstadoDispositivo {
    DISPONIBLE, ASIGNADO, MANTENIMIENTO, BAJA
}