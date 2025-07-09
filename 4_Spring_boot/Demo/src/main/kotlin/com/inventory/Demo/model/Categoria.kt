package com.inventory.Demo.model

import jakarta.persistence.*

@Entity
@Table(name = "categorias")
data class Categoria(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val categoriaId: Long = 0,

    @Column(nullable = false, unique = true, length = 50)
    val nombre: String,

    @Column
    val descripcion: String? = null,

    @OneToMany(mappedBy = "categoria")
    val dispositivos: List<Dispositivo> = emptyList()
)