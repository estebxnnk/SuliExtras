package com.inventory.Demo.model

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "incidentes")
data class Incidente(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val incidenteId: Long = 0,

    @ManyToOne
    @JoinColumn(name = "dispositivo_id", nullable = false)
    val dispositivo: Dispositivo,

    @Column(nullable = false, length = 50)
    val tipo: String,

    @Column
    val fecha: LocalDate? = null,

    @Column(columnDefinition = "TEXT")
    val descripcion: String? = null,

    @Column(columnDefinition = "TEXT")
    val solucion: String? = null
) 