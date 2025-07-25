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
    val imei2: String,

    @Column(name = "procesador", length = 20)
    val procesador: String? = null,

    @Column(name = "ram", length = 20)
    val ram: String? = null,

    @Column(name = "almacenamiento", length = 20)
    val almacenamiento: String? = null,

    @Column(name = "tenable", length = 20)
    val tenable: String? = null,

    @Column(name = "cuenta_gmail_actual", length = 20)
    val cuentaGmailActual: String? = null,
    
    @Column(name = "contrasena_gmail_actual", length = 255)
    val contrasenaGmailActual: String? = null,

    @Column(name = "cuenta_gmail_anterior", length = 20)
    val cuentaGmailAnterior: String? = null,
    
    @Column(name = "contrasena_gmail_anterior", length = 255)
    val contrasenaGmailAnterior: String? = null,

    @Column(name = "ofimatica", length = 20)
    val ofimatica: String? = null,

    @Column(name = "sistema_operativo_movil", nullable = false, length = 100)
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