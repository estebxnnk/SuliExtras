package com.inventory.Demo.modulos.Asignacion.model

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Asignacion.model.EstadoAsignacion
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
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
    val fechaAsignacion: LocalDate,

    @Column(name = "fecha_finalizacion")
    val fechaFinalizacion: LocalDate? = null,

    @Column(name = "motivo_finalizacion", length = 100)
    val motivoFinalizacion: String? = null,

    @Column(name = "estado_asignacion", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    val estado: EstadoAsignacion = EstadoAsignacion.ACTIVA,

    @Column
    val fechaDevolucion: LocalDate? = null,

    @Column
    val comentario: String? = null,

    // Campo nuevo para detalles específicos
    @Column(columnDefinition = "TEXT")
    val observaciones: String? = null // Ej: "Celular de bajas"
)

// Enum para el estado de la asignación
enum class EstadoAsignacion {
    ACTIVA, INACTIVA, FINALIZADA
}