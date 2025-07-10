package com.inventory.Demo.model

import jakarta.persistence.*

@Entity
@Table(name = "empleados")
class Empleado(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "documento_identidad", unique = true)
    val documentoIdentidad: String,

    @Column(name = "nombre_completo")
    val nombreCompleto: String,

    val cargo: String,

    @Column(unique = true)
    val email: String? = null,

    val telefono: String? = null,

    @ManyToOne
    @JoinColumn(name = "area_id")
    val area: Area,

    @OneToMany(mappedBy = "empleado")
    val dispositivos: List<Dispositivo> = emptyList()
)