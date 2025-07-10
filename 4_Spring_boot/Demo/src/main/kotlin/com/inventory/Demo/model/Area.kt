package com.inventory.Demo.model

import jakarta.persistence.*

@Entity
@Table(name = "areas")
class Area(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val nombre: String,

    @Column(name = "subarea")
    val subarea: String? = null,

    @Column(name = "tipo_area")
    val tipoArea: String? = null,

    @OneToMany(mappedBy = "area")
    val empleados: List<Empleado> = emptyList()
) 