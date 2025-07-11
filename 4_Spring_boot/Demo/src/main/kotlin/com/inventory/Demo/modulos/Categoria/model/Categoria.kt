package com.inventory.Demo.modulos.Categoria.model

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table

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