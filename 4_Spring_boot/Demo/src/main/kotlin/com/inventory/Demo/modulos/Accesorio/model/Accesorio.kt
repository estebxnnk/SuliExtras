package com.inventory.Demo.modulos.Accesorio.model

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Asignacion.model.Asignacion
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "accesorios")
data class Accesorio(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, length = 50)
    val tipo: String,               // Ej: "Cargador", "Audífonos"

    @Column(length = 50)
    val marca: String? = null,

    val serial: String,

    @Column(length = 100)
    val modelo: String? = null,

    @Column(nullable = false, length = 20)
    val estado: String,             // Ej: "Bueno", "Dañado", "Perdido"

    @Column(nullable = false)
    val esCombo: Boolean = false,

    @jakarta.persistence.ManyToMany
    @jakarta.persistence.JoinTable(
        name = "combo_accesorios",
        joinColumns = [jakarta.persistence.JoinColumn(name = "combo_id")],
        inverseJoinColumns = [jakarta.persistence.JoinColumn(name = "accesorio_id")]
    )
    val accesoriosCombo: List<Accesorio> = emptyList(),

    @ManyToOne
    @JoinColumn(name = "asignacion_id")
    var asignacion: Asignacion? = null
)