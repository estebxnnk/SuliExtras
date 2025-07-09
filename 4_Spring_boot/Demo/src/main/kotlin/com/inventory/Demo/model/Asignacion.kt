package com.inventory.Demo.model

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "asignaciones")
data class Asignacion(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val asignacionId: Long = 0,

    @ManyToOne
    @JoinColumn(name = "dispositivo_id", nullable = false)
    val dispositivo: Dispositivo,

    @ManyToOne
    @JoinColumn(name = "empleado_id", nullable = false)
    val empleado: Empleado,

    @Column(name = "fecha_asignacion", nullable = false)
    val fechaAsignacion: java.time.LocalDate,

    @Column(name = "fecha_finalizacion")
    val fechaFinalizacion: java.time.LocalDate? = null,

    @Column(name = "motivo_finalizacion", length = 100)
    val motivoFinalizacion: String? = null,

    @Column
    val fechaDevolucion: LocalDate? = null,

    @Column
    val comentario: String? = null,

    // Campo nuevo para detalles específicos
    @Column(columnDefinition = "TEXT")
    val observaciones: String? = null // Ej: "Celular de bajas"
)