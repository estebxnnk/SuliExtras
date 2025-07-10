package com.inventory.Demo.model.TiposDispositivos

import com.inventory.Demo.model.Categoria
import com.inventory.Demo.model.Dispositivo
import com.inventory.Demo.model.Empleado
import com.inventory.Demo.model.EstadoDispositivo
import com.inventory.Demo.model.Sede
import jakarta.persistence.Column
import jakarta.persistence.DiscriminatorValue
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.time.LocalDate

@Entity
@DiscriminatorValue("COMPUTADOR")
@Table(name = "computadores")
class Computador(
    @Column(nullable = false, length = 100)
    val procesador: String,

    @Column(nullable = false, length = 20)
    val ram: String,

    @Column(nullable = false, length = 50)
    val almacenamiento: String,

    @Column(nullable = false, length = 100)
    val sistemaOperativo: String,

    @Column(columnDefinition = "TEXT")
    val softwareAdicional: String? = null,

    // Campos heredados
    dispositivoId: Long = 0,
    serial: String,
    modelo: String,
    marca: String,
    categoria: Categoria,
    sede: Sede,
    empleado: Empleado? = null,
    estado: EstadoDispositivo,
    fechaAdquisicion: LocalDate? = null,
    costo: Double? = null,
    codigoActivo: String,
    tipo: String,
    observaciones: String? = null
) : Dispositivo(
    dispositivoId, serial, modelo, marca, categoria, sede, empleado, estado, fechaAdquisicion, costo, codigoActivo, tipo, observaciones
)