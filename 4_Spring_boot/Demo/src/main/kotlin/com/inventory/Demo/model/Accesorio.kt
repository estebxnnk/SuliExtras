package com.inventory.Demo.model

import jakarta.persistence.*

@Entity
@Table(name = "accesorios")
data class Accesorio(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, length = 50)
    val tipo: String,               // Ej: "Cargador", "Audífonos"

    @Column(length = 50)
    val marca: String? = null,

    @Column(length = 100)
    val modelo: String? = null,

    @Column(nullable = false, length = 20)
    val estado: String,             // Ej: "Bueno", "Dañado", "Perdido"

    @ManyToOne
    @JoinColumn(name = "dispositivo_id", nullable = false)
    val dispositivo: Dispositivo    // Relación con dispositivo
) 