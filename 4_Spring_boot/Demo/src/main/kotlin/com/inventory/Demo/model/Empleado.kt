package com.inventory.Demo.model

import jakarta.persistence.*

@Entity
@Table(name = "empleados")
data class Empleado(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val empleadoId: Long = 0,

    @Column(nullable = false, length = 20)
    val documentoIdentidad: String,

    @Column(nullable = false, length = 100)
    val nombreCompleto: String,

    @Column(length = 100)
    val cargo: String? = null,

    @Column(length = 20)
    val telefono: String? = null,

    @ManyToOne
    @JoinColumn(name = "area_id")
    val area: Area? = null,

    @ManyToOne
    @JoinColumn(name = "sede_id", nullable = false)
    val sede: Sede,

    @OneToMany(mappedBy = "empleado")
    val asignaciones: List<Asignacion> = emptyList()
)