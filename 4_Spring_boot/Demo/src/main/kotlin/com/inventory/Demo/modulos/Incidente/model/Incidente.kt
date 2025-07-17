package com.inventory.Demo.modulos.Incidente.model

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
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