package com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos

import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Categoria.model.Categoria
import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import jakarta.persistence.Column
import jakarta.persistence.DiscriminatorValue
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.time.LocalDate

@Entity
@DiscriminatorValue("CELULAR")
@Table(name = "celulares")
class Celular(
    @Column(nullable = false, length = 15)
    val imei1: String,

    @Column(length = 15)
    val imei2: String? = null,

    @Column(name = "sistema_operativo_movil", nullable = false, length = 100)
    val sistemaOperativoMovil: String,

    @Column(name = "email_asociado", length = 100)
    val emailAsociado: String? = null,

    @Column(name = "contrasena_email", length = 255)
    val contrasenaEmail: String? = null,

    @Column(name = "capacidad_sim", length = 50)
    val capacidadSim: String? = null,

    // Campos heredados
    dispositivoId: Long = 0,
    serial: String,
    modelo: String,
    marca: String,
    categoria: Categoria? = null,
    sede: Sede? = null,
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