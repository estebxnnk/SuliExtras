package com.inventory.Demo.modulos.Area.model

import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Sede.model.Sede
import jakarta.persistence.*

@Entity
@Table(name = "areas")
class Area(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val nombre: String,

    val clase: String?,
    
    val proceso: String,
    
    @Column(name = "subarea")
    val canal: String? = null,

    @Column(name = "subCanal")
    val subCanal: String? = null,

    @ManyToOne
    @JoinColumn(name = "sede_id", nullable = false)
    val sede: Sede
) 