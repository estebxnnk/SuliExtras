package com.inventory.Demo.modulos.Mantenimiento.model

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "mantenimientos")
data class Mantenimiento(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val mantenimientoId: Long = 0,

    @ManyToOne
    @JoinColumn(name = "dispositivo_id", nullable = false)
    val dispositivo: Dispositivo,

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    val tipo: TipoMantenimiento,

    @Column(nullable = false)
    val fechaInicio: LocalDate,

    @Column
    val fechaFin: LocalDate? = null,

    @Column(length = 100)
    val proveedor: String? = null,

    @Column
    val costo: Double? = null,

    @Column
    val descripcion: String? = null
)

enum class TipoMantenimiento {
    PREVENTIVO, CORRECTIVO, ACTUALIZACION
}