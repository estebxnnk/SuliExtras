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
    val imei1: String,

    val imei2: String,

    @Column(name = "procesador")
    val procesador: String? = null,

    @Column(name = "ram")
    val ram: String? = null,

    @Column(name = "almacenamiento")
    val almacenamiento: String? = null,

    @Column(name = "tenable")
    val tenable: Boolean? = null,

    @Column(name = "cuenta_gmail_actual")
    val cuentaGmailActual: String? = null,
    
    @Column(name = "contrasena_gmail_actual")
    val contrasenaGmailActual: String? = null,

    @Column(name = "cuenta_gmail_anterior")
    val cuentaGmailAnterior: String? = null,
    
    @Column(name = "contrasena_gmail_anterior")
    val contrasenaGmailAnterior: String? = null,

    @Column(name = "ofimatica", length = 20)
    val ofimatica: String? = null,

    @Column(name = "sistema_operativo_movil")
    val sistemaOperativoMovil: String? = null,

    // Campos heredados
    dispositivoId: Long = 0,
    item: String?,
    serial: String?,
    modelo: String?,
    marca: String?,
    categoria: Categoria? = null,
    sede: Sede? = null,
    estado: EstadoDispositivo,
    clasificacion: String,
    fechaAdquisicion: LocalDate? = null,
    costo: Double? = null,
    funcional: Boolean? = null,
    codigoActivo: String? = null,
    tipo: String?,
    observaciones: String? = null,
) : Dispositivo(
    dispositivoId, item, serial, modelo, marca, categoria, sede, estado, clasificacion, fechaAdquisicion, costo, funcional, codigoActivo, tipo, observaciones
)