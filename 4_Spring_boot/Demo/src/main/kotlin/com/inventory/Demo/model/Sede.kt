package com.inventory.Demo.model

import jakarta.persistence.*

@Entity
@Table(name = "sedes")
class Sede(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val nombre: String,

    val ciudad: String,

    @OneToMany(mappedBy = "sede")
    val dispositivos: List<Dispositivo> = emptyList()
)