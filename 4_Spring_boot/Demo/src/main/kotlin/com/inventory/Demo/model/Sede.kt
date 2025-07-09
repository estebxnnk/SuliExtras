package com.inventory.Demo.model

import jakarta.persistence.*

@Entity
@Table(name = "sedes")
data class Sede(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val sedeId: Long = 0,

    @Column(nullable = false, length = 100)
    val nombre: String,

    @Column(nullable = false)
    val direccion: String,

    @Column(nullable = false, length = 50)
    val ciudad: String,

    @Column(length = 30)
    val pais: String = "Colombia",

    @Column(length = 20)
    val telefono: String? = null,

    @OneToMany(mappedBy = "sede", cascade = [CascadeType.ALL])
    val dispositivos: List<Dispositivo> = emptyList()
)