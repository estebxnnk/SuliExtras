package com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos

import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Categoria.model.Categoria
import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import com.inventory.Demo.modulos.Accesorio.model.Accesorio
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
    accesorios: List<Accesorio> = emptyList()
) : Dispositivo(
    dispositivoId, item, serial, modelo, marca, categoria, sede, estado, clasificacion, fechaAdquisicion, costo, codigoActivo, tipo, observaciones, accesorios
)