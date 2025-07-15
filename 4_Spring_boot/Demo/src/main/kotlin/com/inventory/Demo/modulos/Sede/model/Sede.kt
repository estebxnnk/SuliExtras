package com.inventory.Demo.modulos.Sede.model

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import jakarta.persistence.*

@Entity
@Table(name = "sedes")
class Sede(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val nombre: String,

    val ubicacion: String,

    val ciudad: String,

    @OneToMany(mappedBy = "sede")
    val dispositivos: List<Dispositivo> = emptyList()
)