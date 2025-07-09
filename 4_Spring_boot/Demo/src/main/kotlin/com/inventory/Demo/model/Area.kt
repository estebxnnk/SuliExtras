package com.inventory.Demo.model

import jakarta.persistence.*

@Entity
@Table(name = "areas")
data class Area(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val areaId: Long = 0,

    @Column(nullable = false, length = 100)
    val nombre: String,

    @Column(length = 100)
    val subarea: String? = null,

    @Column(name = "tipo_area", length = 100)
    val tipoArea: String? = null,
) 