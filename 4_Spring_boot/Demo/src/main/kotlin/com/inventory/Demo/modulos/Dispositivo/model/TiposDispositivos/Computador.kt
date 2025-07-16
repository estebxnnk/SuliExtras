package com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos

import com.inventory.Demo.modulos.Categoria.model.Categoria
import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import com.inventory.Demo.modulos.Accesorio.model.Accesorio
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

    val almacenamiento2: String,

    val mac: String,

    val ofimatica: String,

    val antivirus: String, // Solo en Computador

    @Column(nullable = false, length = 100)
    val sistemaOperativo: String,

    @Column(columnDefinition = "TEXT")
    val softwareAdicional: String? = null,

    // Campos heredados
    dispositivoId: Long = 0,
    item: String,
    serial: String,
    modelo: String,
    marca: String,
    categoria: Categoria? = null,
    sede: Sede? = null,
    estado: EstadoDispositivo,
    clasificacion: String,
    fechaAdquisicion: LocalDate? = null,
    costo: Double? = null,
    codigoActivo: String,
    tipo: String,
    observaciones: String? = null,
) : Dispositivo(
    dispositivoId, item, serial, modelo, marca, categoria, sede, estado, clasificacion, fechaAdquisicion, costo, codigoActivo, tipo, observaciones
)